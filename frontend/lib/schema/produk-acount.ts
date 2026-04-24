// src/lib/validations/game-account.ts
import { z } from "zod";

export const AccountSchema = z.object({
    name: z.string().min(3, "Nama produk minimal 3 karakter"),
  slug: z
    .string()
    .min(3, "Slug minimal 3 karakter")
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan minus"),
  description: z.string().min(20, "Deskripsi minimal 20 karakter"),
  price: z.coerce.number().int().positive("Harga harus lebih dari 0"),
  stock: z.coerce.number().int().min(0, "Stok tidak boleh negatif"),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  gameTitle: z.string().min(2, "Nama game wajib diisi"),
  accountLevel: z.coerce.number().int().min(0).optional(),
  rank: z.string().optional(),
  serverRegion: z.string().optional(),
  loginMethod: z.string().optional(),
  thumbnailUrl: z.string().url("URL thumbnail tidak valid").optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED", "SOLD", "ARCHIVED"]),
});

export type AccountInput = z.input<typeof AccountSchema>;
export type AccountOutput = z.output<typeof AccountSchema>;