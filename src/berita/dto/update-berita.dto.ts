import { ApiPropertyOptional } from "@nestjs/swagger";
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

export class UpdateBeritaDto {
  @ApiPropertyOptional({ example: 'Judul Berita', description: 'Judul dari berita' })
  judulBerita?: string;

  @ApiPropertyOptional({ example: 'Deskripsi Berita', description: 'Deskripsi dari berita' })
  deskripsiBerita?: string;

  @ApiPropertyOptional({ example: '2024-07-03', description: 'Tanggal berita' })
  tanggalBerita?: string;

  @ApiPropertyOptional({ example: 'path/to/foto.jpg', description: 'Path foto untuk berita' })
  fotoBerita?: string;

  @ApiPropertyOptional({ example: 'John Doe', description: 'Penulis berita' })
  authorBerita?: string;

  @ApiPropertyOptional({ example: 'Jane Doe', description: 'Editor berita' })
  editorBerita?: string;

  @ApiPropertyOptional({ example: 'path/to/foto-content.jpg', description: 'Path foto konten berita' })
  fotoContent?: string;

  @ApiPropertyOptional({ example: '2024-07-03T04:48:57.000Z', description: 'Tanggal dipublikasikan' })
  publishedAt?: string;

  @ApiPropertyOptional({ example: 'Deskripsi Berita 2', description: 'Deskripsi tambahan berita (opsional)' })
  deskripsiBerita2?: string;

  @ApiPropertyOptional({ example: 'Deskripsi Berita 3', description: 'Deskripsi tambahan berita (opsional)' })
  deskripsiBerita3?: string;

  @ApiPropertyOptional({ example: 'Deskripsi Berita 4', description: 'Deskripsi tambahan berita (opsional)' })
  deskripsiBerita4?: string;

  @ApiPropertyOptional({ example: 'Deskripsi Berita 5', description: 'Deskripsi tambahan berita (opsional)' })
  deskripsiBerita5?: string;

  @ApiPropertyOptional({ example: 'Deskripsi Berita 6', description: 'Deskripsi tambahan berita (opsional)' })
  deskripsiBerita6?: string;

  @ApiPropertyOptional({ example: 'Deskripsi Berita 7', description: 'Deskripsi tambahan berita (opsional)' })
  deskripsiBerita7?: string;

  @ApiPropertyOptional({ example: 'Deskripsi Berita 8', description: 'Deskripsi tambahan berita (opsional)' })
  deskripsiBerita8?: string;

  @ApiPropertyOptional({ example: 'Deskripsi Berita 9', description: 'Deskripsi tambahan berita (opsional)' })
  deskripsiBerita9?: string;

  constructor(data: any) {
    const validatedData = UpdateBeritaDtoSchema.parse(data);
    Object.assign(this, validatedData);
  }
}