import { z } from 'zod';

export const UpdateTotalSchema = z.object({
    total: z.number().optional(),
    nama: z.optional(z.enum(['umkm', 'penggerak', 'usaha', 'swasta', 'pemerintah', 'pendidikan'])),
    publishedAt: z.date().nullable().optional(),
});

export type UpdateTotalDto = z.infer<typeof UpdateTotalSchema>;