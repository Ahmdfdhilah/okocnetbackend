import { z } from 'zod';

export const UpdateBannerDto = z.object({
  foto: z.string().nullable().optional(),
  publishedAt: z.string().nullable().optional(),
});

export type UpdateBannerDto = z.infer<typeof UpdateBannerDto>;