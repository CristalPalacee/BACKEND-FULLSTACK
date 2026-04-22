import { z } from 'zod';

// 1. Buat skema untuk validasi
export const JwtPayloadSchema = z.object({
  id: z.string().optional(),
  sub: z.string().uuid('ID User harus format UUID'), // Sesuaikan jika ID kamu number
  email: z.string().email('Format email tidak valid'),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

// 2. Extract tipe data dari skema tersebut
export type JwtPayload = z.infer<typeof JwtPayloadSchema>;
