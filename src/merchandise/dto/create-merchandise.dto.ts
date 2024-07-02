import { z } from 'zod';

export const CreateMerchandiseSchema = z.object({
  judulMerchandise: z.string(),
  deskripsiMerchandise: z.string().optional(),
  hargaMerchandise: z.string(),
  stockMerchandise: z.string(),
  linkMerchandise: z.string(),
  fotoMerchandise: z.string(),
  publishedAt: z.string(),
});

export type CreateMerchandiseDto = z.infer<typeof CreateMerchandiseSchema>;