import { z } from 'zod';

export const CreateTotalSchema = z.object({
    total: z.number(),
    nama: z.enum(['umkm', 'penggerak', 'usaha', 'swasta', 'pemerintah', 'pendidikan']),
    publishedAt: z.date().nullable(),
});

export type CreateTotalDto = z.infer<typeof CreateTotalSchema>;
