import { z } from 'zod';

export const UpdateAnniversarySchema = z.object({
  judul: z.string().optional(),
  year: z.number().optional(),
  deskripsi: z.string().optional(),
  videoLink: z.string().optional(),
  publishedAt: z.string().optional(),
});

export type UpdateAnniversaryDto = z.infer<typeof UpdateAnniversarySchema>;