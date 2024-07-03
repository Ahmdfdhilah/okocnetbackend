import { z } from 'zod';

export const CreatePengurusSchema = z.object({
 namaFounder: z.string(),
 jabatanFounder: z.string(),
 fotoFounder: z.string(),
 publishedAt: z.string(),
});

export type CreatePengurusDto = z.infer<typeof CreatePengurusSchema>;