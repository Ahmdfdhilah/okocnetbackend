import { z } from 'zod';

export const CreateMitraDto = z.object({
    foto: z.string().nullable(),
    publishedAt: z.string().datetime().nullable(),
});

export type CreateMitraDto = z.infer<typeof CreateMitraDto>;
