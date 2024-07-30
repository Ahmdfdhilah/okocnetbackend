import { z } from 'zod';

export const UpdateSyaratMasterMentorSchema = z.object({
    deskripsi: z.string().optional(),
    img: z.string().optional(),
});

export type UpdateSyaratMasterMentorDto = z.infer<typeof UpdateSyaratMasterMentorSchema>;
