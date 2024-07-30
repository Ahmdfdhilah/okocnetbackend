import { z } from 'zod';

export const CreateSyaratMasterMentorSchema = z.object({
    deskripsi: z.string(),
    img: z.string(),
});

export type CreateSyaratMasterMentorDto = z.infer<typeof CreateSyaratMasterMentorSchema>;
