import { z } from 'zod';

export const CreateBenefitTrainerSchema = z.object({
    judul: z.string(),
    deskripsi: z.string(),
});

export type CreateBenefitTrainerDto = z.infer<typeof CreateBenefitTrainerSchema>;
