import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateOrderSchema = z.object({
  userId: z.string().uuid('ID User harus format UUID'),
  items: z
    .array(
      z.object({
        productId: z.string().uuid('ID Produk harus format UUID'),
        quantity: z.number().int().positive('Kuantitas minimal 1'),
      }),
    )
    .min(1, 'Pesanan tidak boleh kosong'),
});

export class CreateOrderDto extends createZodDto(CreateOrderSchema) {}
