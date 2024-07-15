import { z } from 'zod';

export const UpdateTotalSchema = z.object({
    total: z.number().optional(),
    nama: z.string().min(1).max(255).optional(),
    publishedAt: z.date().nullable().optional(),
});

export type UpdateTotalDto = z.infer<typeof UpdateTotalSchema>;