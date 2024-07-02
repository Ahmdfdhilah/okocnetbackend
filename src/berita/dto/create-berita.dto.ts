import { z } from 'zod';

export const CreateBeritaDtoSchema = z.object({
  judulBerita: z.string().max(255),
  deskripsiBerita: z.string(),
  tanggalBerita: z.string(),
  fotoBerita: z.string(),
  authorBerita: z.string(),
  editorBerita: z.string(),
  fotoContent: z.string(),
  deskripsiBerita2: z.string().optional(),
  deskripsiBerita3: z.string().optional(),
  deskripsiBerita4: z.string().optional(),
  deskripsiBerita5: z.string().optional(),
  deskripsiBerita6: z.string().optional(),
  deskripsiBerita7: z.string().optional(),
  deskripsiBerita8: z.string().optional(),
  deskripsiBerita9: z.string().optional(),
  publishedAt: z.string(),
});

export type CreateBeritaDtoType = z.infer<typeof CreateBeritaDtoSchema>;