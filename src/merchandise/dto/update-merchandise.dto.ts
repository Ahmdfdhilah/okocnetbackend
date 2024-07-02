import { z } from 'zod';

export const UpdateMerchandiseSchema = z.object({
  judulMerchandise: z.string().optional(),
  deskripsiMerchandise: z.string().optional(),
  hargaMerchandise: z.string().optional(),
  stockMerchandise: z.string().optional(),
  fotoMerchandise: z.string().optional(),
  linkMerchandise: z.string().optional(),
  publishedAt: z.string().optional(),
});

export type UpdateMerchandiseDto = z.infer<typeof UpdateMerchandiseSchema>;
