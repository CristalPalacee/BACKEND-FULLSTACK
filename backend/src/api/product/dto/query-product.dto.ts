import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const QueryProductSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
  q: z.string().optional(),
  categorySlug: z.string().optional(),
  featured: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => {
      if (val === undefined) return undefined;
      if (typeof val === 'boolean') return val;
      return val === 'true';
    }),
});

export class QueryProductDto extends createZodDto(QueryProductSchema) {}
