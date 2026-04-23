import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as MidtransClient from 'midtrans-client';
import * as crypto from 'crypto';

type MidtransNotificationPayload = {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status: string;
  fraud_status?: string;
  payment_type?: string;
};
@Injectable()
export class PaymentService {
  private readonly snap: MidtransClient.Snap;

  constructor(private readonly prisma: PrismaService) {
    this.snap = new MidtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
      clientKey: process.env.MIDTRANS_CLIENT_KEY!,
    });
  }

  async createSnapTransaction(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order tidak ditemukan');
    }

    if (order.userId !== userId) {
      throw new BadRequestException('Order ini bukan milik Anda');
    }

    if (order.status !== 'PENDING') {
      throw new BadRequestException(
        'Order sudah diproses atau tidak bisa dibayar',
      );
    }

    if (!order.items.length) {
      throw new BadRequestException('Order tidak memiliki item');
    }

    const item_details = order.items.map((item) => ({
      id: item.productId,
      name: item.product.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const grossAmount = order.total;

    const parameter = {
      transaction_details: {
        order_id: order.id,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: order.user.name ?? 'Customer',
        email: order.user.email,
      },
      item_details,
      callbacks: {
        finish: process.env.MIDTRANS_FINISH_URL,
        unfinish: process.env.MIDTRANS_UNFINISH_URL,
        error: process.env.MIDTRANS_ERROR_URL,
      },
    };

    const transaction = await this.snap.createTransaction(parameter);

    await this.prisma.order.update({
      where: { id: order.id },
      data: {
        paymentToken: transaction.token,
        paymentRedirectUrl: transaction.redirect_url,
      },
    });

    return {
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    };
  }

  verifySignature(payload: {
    order_id: string;
    status_code: string;
    gross_amount: string;
    signature_key: string;
  }) {
    const raw =
      payload.order_id +
      payload.status_code +
      payload.gross_amount +
      process.env.MIDTRANS_SERVER_KEY;

    const expected = crypto.createHash('sha512').update(raw).digest('hex');

    return expected === payload.signature_key;
  }

  async handleNotification(notification: MidtransNotificationPayload) {
    const isValid = this.verifySignature({
      order_id: notification.order_id,
      status_code: notification.status_code,
      gross_amount: notification.gross_amount,
      signature_key: notification.signature_key,
    });

    if (!isValid) {
      throw new BadRequestException('Signature Midtrans tidak valid');
    }

    const order = await this.prisma.order.findUnique({
      where: { id: notification.order_id },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order tidak ditemukan');
    }

    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    let nextOrderStatus: 'PENDING' | 'PAID' | 'CANCELLED' | 'COMPLETED' =
      order.status as any;

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'accept') {
        nextOrderStatus = 'PAID';
      }
    } else if (transactionStatus === 'settlement') {
      nextOrderStatus = 'PAID';
    } else if (
      transactionStatus === 'cancel' ||
      transactionStatus === 'deny' ||
      transactionStatus === 'expire'
    ) {
      nextOrderStatus = 'CANCELLED';
    } else if (transactionStatus === 'pending') {
      nextOrderStatus = 'PENDING';
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: nextOrderStatus,
          paymentType: notification.payment_type ?? null,
          transactionStatus: transactionStatus ?? null,
          paymentRawResponse: notification,
        },
      });

      if (nextOrderStatus === 'PAID') {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
              status: item.quantity >= 1 ? 'SOLD' : undefined,
            },
          });
        }
      }
    });

    return {
      received: true,
      orderId: order.id,
      transactionStatus,
      nextOrderStatus,
    };
  }
}
