import { z } from 'zod';

export const CreateProfileDto = z.object({
    foto: z.string().nullable(),
    nama: z.string().nullable(),
    posisi: z.string().nullable(),
    publishedAt: z.string().datetime().nullable(),
});

export type CreateProfileDto = z.infer<typeof CreateProfileDto>;