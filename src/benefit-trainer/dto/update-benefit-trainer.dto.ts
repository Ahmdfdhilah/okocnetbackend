import { z } from 'zod';

export const UpdateBenefitTrainerSchema = z.object({
    judul: z.string().optional(),
    deskripsi: z.string().optional(),
});

export type UpdateBenefitTrainerDto = z.infer<typeof UpdateBenefitTrainerSchema>;
