import { z } from 'zod';

export const UpdateMasterMentorSchema = z.object({
    urlMasterMentor: z.string().optional(),
    publishedAt: z.string().optional(),
});

export type UpdateMasterMentorDto = z.infer<typeof UpdateMasterMentorSchema>;