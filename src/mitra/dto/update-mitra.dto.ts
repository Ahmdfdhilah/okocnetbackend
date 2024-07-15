import { z } from 'zod';

export const UpdateMitraDto = z.object({
    foto: z.string().nullable(),
    publishedAt: z.string().datetime().nullable(),
});

export type UpdateMitraDto = z.infer<typeof UpdateMitraDto>;
