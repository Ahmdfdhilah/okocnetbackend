import { z } from 'zod';

export const UpdatePengurusSchema = z.object({
 namaFounder: z.string().optional(),
 jabatanFounder: z.string().optional(),
 fotoFounder: z.string().optional(),
 publishedAt: z.string().optional(),
});

export type UpdatePengurusDto = z.infer<typeof UpdatePengurusSchema>;