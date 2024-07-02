import { z } from 'zod';

export const updateBrandLokalSchema = z.object({
  judulBrand: z.string().optional(),
  deskripsiBrand: z.string().optional(),
  fotoBrand: z.string().optional(),
});

export type UpdateBrandLokalDto = z.infer<typeof updateBrandLokalSchema>;