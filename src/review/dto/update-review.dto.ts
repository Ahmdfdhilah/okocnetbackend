import { z } from 'zod';

export const UpdateReviewSchema = z.object({
    foto: z.string().nullable(),
    nama: z.string().nullable(),
    posisi: z.string().nullable(),
    deskripsi: z.string().nullable(),
    publishedAt: z.string().datetime().nullable(),
});

export type UpdateReviewDto = z.infer<typeof UpdateReviewSchema>;