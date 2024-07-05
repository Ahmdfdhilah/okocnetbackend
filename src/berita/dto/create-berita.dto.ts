import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const CreateBeritaDtoSchema = z.object({
  judulBerita: z.string(),
  deskripsiBerita: z.array(z.string()),
  tanggalBerita: z.string(),
  fotoBerita: z.string(),
  authorBerita: z.string(),
  editorBerita: z.string(),
  fotoContent: z.string(),
  publishedAt: z.string(),
});

export class CreateBeritaDto {
  @ApiProperty({ example: 'Judul Berita', description: 'Judul dari berita' })
  judulBerita: string;

  @ApiProperty({
    example: ['Deskripsi Berita 1', 'Deskripsi Berita 2'],
    description: 'Deskripsi dari berita',
    type: [String],
  })
  deskripsiBerita: string[];

  @ApiProperty({ example: '2024-07-03', description: 'Tanggal berita' })
  tanggalBerita: string;

  @ApiProperty({ example: 'path/to/foto.jpg', description: 'Path foto untuk berita' })
  fotoBerita: string;

  @ApiProperty({ example: 'John Doe', description: 'Penulis berita' })
  authorBerita: string;

  @ApiProperty({ example: 'Jane Doe', description: 'Editor berita' })
  editorBerita: string;

  @ApiProperty({ example: 'path/to/foto-content.jpg', description: 'Path foto konten berita' })
  fotoContent: string;

  @ApiProperty({ example: '2024-07-03T04:48:57.000Z', description: 'Tanggal dipublikasikan' })
  publishedAt: string;

  constructor(data: any) {
    const validatedData = CreateBeritaDtoSchema.parse(data);
    Object.assign(this, validatedData);
  }
}