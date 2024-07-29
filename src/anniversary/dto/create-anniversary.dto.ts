import { z } from 'zod';
export const CreateAnniversarySchema = z.object({
  judul: z.string(),
  year: z.number(),
  deskripsi: z.string(),
  videoLink: z.string(),
  publishedAt: z.string().optional(),
});

export type CreateAnniversaryDto = z.infer<typeof CreateAnniversarySchema>;