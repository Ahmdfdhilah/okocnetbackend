import { z } from 'zod';

export const CreateBenefitMasterMentorSchema = z.object({
    judul: z.string(),
    deskripsi: z.string(),
});

export type CreateBemefitMasterMentorDto = z.infer<typeof CreateBenefitMasterMentorSchema>;