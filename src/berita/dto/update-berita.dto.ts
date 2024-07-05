import { ApiPropertyOptional } from "@nestjs/swagger";
import { z } from 'zod';

export const UpdateBeritaDtoSchema = z.object({
  judulBerita: z.string().optional(),
  deskripsiBerita: z.array(z.string()).optional(),
  tanggalBerita: z.string().optional(),
  fotoBerita: z.string().optional(),
  authorBerita: z.string().optional(),
  editorBerita: z.string().optional(),
  fotoContent: z.string().optional(),
  publishedAt: z.string().optional(),
});

export class UpdateBeritaDto {
  @ApiPropertyOptional({ example: 'Judul Berita', description: 'Judul dari berita' })
  judulBerita?: string;

  @ApiPropertyOptional({
    example: ['Deskripsi Berita 1', 'Deskripsi Berita 2'],
    description: 'Deskripsi dari berita',
    type: [String],
  })
  deskripsiBerita?: string[];

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

  constructor(data: any) {
    const validatedData = UpdateBeritaDtoSchema.parse(data);
    Object.assign(this, validatedData);
  }
}