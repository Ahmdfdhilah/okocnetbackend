import { z } from 'zod';

export const CreateSyaratTrainerSchema = z.object({
    judul: z.string(),
    deskripsi: z.string(),
});

export type CreateSyaratTrainerDto = z.infer<typeof CreateSyaratTrainerSchema>;