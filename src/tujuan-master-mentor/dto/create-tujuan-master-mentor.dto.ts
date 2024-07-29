import { z } from 'zod';

export const CreateTujuanMasterMentorSchema = z.object({
    judul: z.string(),
    deskripsi: z.string(),
});

export type CreateTujuanMasterMentorDto = z.infer<typeof CreateTujuanMasterMentorSchema>;