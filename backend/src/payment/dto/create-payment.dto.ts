import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreatePaymentSchema = z.object({
  orderId: z.string().uuid('Order ID tidak valid'),
});

export class CreatePaymentDto extends createZodDto(CreatePaymentSchema) {}
