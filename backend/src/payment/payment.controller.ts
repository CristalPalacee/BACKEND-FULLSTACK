// src/modules/payment/payment.controller.ts
import { Controller, Post, Body } from '@nestjs/common';

import { PaymentService } from './payment.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('payment')
export class PaymentController {
  private core: any;

  constructor(
    private paymentService: PaymentService,
    private prisma: PrismaService,
  ) {}

  @Post('create')
  async createPayment(
    @Body() data: { orderId: string; amount: number; email: string },
  ) {
    const result = await this.paymentService.createTransaction(
      data.orderId,
      data.amount,
      data.email,
    );
    return {
      success: true,
      data: result,
    };
  }

  @Post('webhook')
  async handleWebhook(@Body() payload: any) {
    try {
      // ✅ Midtrans kirim langsung via HTTP POST, tinggal parse
      const { order_id, transaction_status, fraud_status } =
        this.paymentService.handleNotification(payload);

      console.log(
        `Webhook - Order: ${order_id} | Status: ${transaction_status}`,
      );

      // Mapping status
      let newStatus = 'PENDING';

      if (transaction_status === 'capture') {
        newStatus = fraud_status === 'challenge' ? 'CHALLENGE' : 'PAID';
      } else if (transaction_status === 'settlement') {
        newStatus = 'PAID'; // QRIS / GoPay / Transfer
      } else if (
        transaction_status === 'cancel' ||
        transaction_status === 'deny' ||
        transaction_status === 'expire'
      ) {
        newStatus = 'CANCELLED';
      } else if (transaction_status === 'pending') {
        newStatus = 'PENDING';
      }

      // Update database
      await this.prisma.order.update({
        where: { id: order_id },
        data: { status: newStatus },
      });

      // ✅ Midtrans butuh response 200 OK
      return { status: 'success' };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      console.error('Webhook Error:', msg);
      return { status: 'error', message: msg };
    }
  }
}
