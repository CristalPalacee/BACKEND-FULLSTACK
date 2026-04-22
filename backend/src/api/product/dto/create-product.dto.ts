import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// 1. Skema Zod untuk Product sesuai workflow
export const CreateProductSchema = z.object({
  name: z.string().min(3, 'Nama produk minimal 3 karakter'),
  price: z.number().int().positive('Harga harus angka positif'),
  stock: z.number().int().nonnegative('Stok tidak boleh negatif'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  category: z.string().min(1, 'Pilih kategori produk'),
});

// 2. Class DTO yang dihasilkan dari skema
export class CreateProductDto extends createZodDto(CreateProductSchema) {}
