import { z } from 'zod';

export const UpdateProfileDto = z.object({
    foto: z.string().nullable(),
    nama: z.string().nullable(),
    posisi: z.string().nullable(),
    publishedAt: z.string().datetime().nullable(),
});

export type UpdateProfileDto = z.infer<typeof UpdateProfileDto>;