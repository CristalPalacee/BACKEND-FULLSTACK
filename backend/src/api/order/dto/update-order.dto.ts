import { CreateOrderSchema } from './create-order.dto';
import { createZodDto } from 'nestjs-zod';

export const UpdateOrderSchema = CreateOrderSchema.partial();
export class UpdateOrderDto extends createZodDto(UpdateOrderSchema) {}
