import { z } from 'zod';

export const UpdateBenefitMasterMentorSchema = z.object({
    judul: z.string().optional(),
    deskripsi: z.string().optional(),
});

export type UpdateBenefitMasterMentorDto = z.infer<typeof UpdateBenefitMasterMentorSchema>;