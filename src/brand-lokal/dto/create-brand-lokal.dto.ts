import { z } from 'zod';

export const createBrandLokalSchema = z.object({
  judulBrand: z.string(),
  deskripsiBrand: z.string(),
  fotoBrand: z.string(),
  publishedAt: z.string(),
});

export type CreateBrandLokalDto = z.infer<typeof createBrandLokalSchema>;