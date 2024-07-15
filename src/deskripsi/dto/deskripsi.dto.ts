import { z } from 'zod';

export const DeskripsiSchema = z.object({
    title: z.string().min(1).max(255),
    deskripsi: z.string().min(1),
    publishedAt: z.optional(z.string()), 
});

export type DeskripsiDTO = z.infer<typeof DeskripsiSchema>;
