import { z } from 'zod';

export const CreateBannerDto = z.object({
  foto: z.string().nullable().optional(),
  publishedAt: z.string().nullable().optional(),
});

export type CreateBannerDto = z.infer<typeof CreateBannerDto>;