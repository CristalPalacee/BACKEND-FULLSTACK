import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateProductSchema = z.object({
  slug: z
    .string()
    .min(3, 'Slug minimal 3 karakter')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug hanya boleh huruf kecil, angka, dan tanda minus',
    ),
  name: z.string().min(3, 'Nama produk minimal 3 karakter'),
  price: z.coerce.number().int().positive('Harga harus angka positif'),
  stock: z.coerce.number().int().nonnegative('Stok tidak boleh negatif'),
  description: z.string().min(20, 'Deskripsi minimal 20 karakter'),
  categoryId: z.string().uuid('Kategori tidak valid'),
  gameTitle: z.string().min(2, 'Nama game wajib diisi'),
  accountLevel: z.coerce.number().int().nonnegative().optional(),
  rank: z.string().optional(),
  serverRegion: z.string().optional(),
  loginMethod: z.string().optional(),
  thumbnailUrl: z.string().url('Thumbnail harus berupa URL valid').optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SOLD', 'ARCHIVED']).optional(),
  isFeatured: z.boolean().optional(),
  isPopular: z.boolean().optional(),
});

export class CreateProductDto extends createZodDto(CreateProductSchema) {}
