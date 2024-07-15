import { z } from 'zod';

export const CreateTotalSchema = z.object({
    total: z.number(),
    nama: z.string().min(1).max(255),
    publishedAt: z.date().nullable(),
});

export type CreateTotalDto = z.infer<typeof CreateTotalSchema>;
