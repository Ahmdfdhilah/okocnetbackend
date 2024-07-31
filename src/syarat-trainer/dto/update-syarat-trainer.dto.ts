import { z } from 'zod';

export const UpdateSyaratTrainerSchema = z.object({
    judul: z.string().optional(),
    deskripsi: z.string().optional(),
});

export type UpdateSyaratTrainerDto = z.infer<typeof UpdateSyaratTrainerSchema>;