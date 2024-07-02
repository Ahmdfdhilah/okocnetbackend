import { z } from 'zod';

export const UpdateBeritaDtoSchema = z.object({
  judulBerita: z.string().max(255).optional(),
  deskripsiBerita: z.string().optional(),
  tanggalBerita: z.string().optional(),
  fotoBerita: z.string().optional(),
  authorBerita: z.string().optional(),
  editorBerita: z.string().optional(),
  fotoContent: z.string().optional(),
  deskripsiBerita2: z.string().optional(),
  deskripsiBerita3: z.string().optional(),
  deskripsiBerita4: z.string().optional(),
  deskripsiBerita5: z.string().optional(),
  deskripsiBerita6: z.string().optional(),
  deskripsiBerita7: z.string().optional(),
  deskripsiBerita8: z.string().optional(),
  deskripsiBerita9: z.string().optional(),
  publishedAt: z.string().optional(),
});

export type UpdateBeritaDtoType = z.infer<typeof UpdateBeritaDtoSchema>;