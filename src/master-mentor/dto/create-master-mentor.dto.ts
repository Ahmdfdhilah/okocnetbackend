import { z } from 'zod';

export const CreateMasterMentorSchema = z.object({
  urlMasterMentor: z.string(),
  publishedAt: z.string(),
});

export type CreateMasterMentorDto = z.infer<typeof CreateMasterMentorSchema>;