import { z } from 'zod';

export const CreatePenggerakOkoceSchema = z.object({
    namaPenggerak: z.string().min(1).max(255),
    deskripsiPenggerak: z.string().min(1),
    fotoPenggerak: z.string().min(1),
    publishedAt: z.string().optional(),
});

export type CreatePenggerakOkoceDto = z.infer<typeof CreatePenggerakOkoceSchema>;
