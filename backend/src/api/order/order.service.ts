import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Prisma } from 'generated/prisma/client';
@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.order.findMany({
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }

  async createOrder(data: CreateOrderDto) {
    return await this.prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsData: Prisma.OrderItemUncheckedCreateWithoutOrderInput[] =
        [];

      for (const item of data.items) {
        // 1. Validate Product & Stock
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product)
          throw new NotFoundException(
            `Produk ${item.productId} tidak ditemukan`,
          );
        if (product.stock < item.quantity) {
          throw new BadRequestException(`Stok untuk ${product.name} habis!`);
        }

        // 2. Calculate Price
        totalAmount += product.price * item.quantity;

        // 3. Prepare data & Decrement Stock
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });

        orderItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        });
      }

      // 4. Create Order with Status PENDING
      const order = await tx.order.create({
        data: {
          userId: data.userId,
          total: totalAmount,
          status: 'PENDING',
          items: {
            create: orderItemsData,
          },
        },
        include: { items: { include: { product: true } } },
      });

      // 5. Integration Placeholder: Generate Midtrans/Xendit URL
      // Di sini nanti kita panggil PaymentService
      const paymentUrl = `https://checkout.paymentgateway.com/v1/${order.id}`;

      return {
        message: 'Order created successfully',
        orderId: order.id,
        total: order.total,
        paymentUrl,
      };
    });
  }

  async getOrderById(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });
  }
}
