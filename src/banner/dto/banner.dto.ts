import { z } from 'zod';

export const BannerDtoSchema = z.object({
  foto: z.string().nullable().optional(),
  publishedAt: z.string().nullable().optional(),
});

export type BannerDto = z.infer<typeof BannerDtoSchema>;