import { CreateCategorySchema } from './create-category.dto';
import { createZodDto } from 'nestjs-zod';
export const UpdateCategorySchema = CreateCategorySchema.partial();
export class UpdateCategoryDto extends createZodDto(UpdateCategorySchema) {}
