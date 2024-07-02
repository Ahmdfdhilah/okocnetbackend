import { z } from 'zod';

export const UpdatePenggerakOkoceSchema = z.object({
    namaPenggerak: z.string().min(1).max(255).optional(),
    deskripsiPenggerak: z.string().min(1).optional(),
    fotoPenggerak: z.string().min(1).optional(),
    publishedAt: z.string().optional(),
});

export type UpdatePenggerakOkoceDto= z.infer<typeof UpdatePenggerakOkoceSchema>;
