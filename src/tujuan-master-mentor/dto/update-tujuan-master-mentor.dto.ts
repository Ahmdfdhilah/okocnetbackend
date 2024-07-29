import { z } from 'zod';

export const UpdateTujuanMasterMentorSchema = z.object({
    judul: z.string().optional(),
    deskripsi: z.string().optional(),
});

export type UpdateTujuanMasterMentorDto = z.infer<typeof UpdateTujuanMasterMentorSchema>;