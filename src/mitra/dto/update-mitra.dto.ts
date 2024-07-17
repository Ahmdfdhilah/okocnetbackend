import { z } from 'zod';

export const UpdateMitraDto = z.object({
    nama: z.string().nullable(),
    foto: z.string().nullable(),
    publishedAt: z.string().datetime().nullable(),
});

export type UpdateMitraDto = z.infer<typeof UpdateMitraDto>;
