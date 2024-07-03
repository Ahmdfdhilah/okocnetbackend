import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

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

export class CreateBeritaDto {
  @ApiProperty({ example: 'Judul Berita', description: 'Judul dari berita' })
  judulBerita: string;

  @ApiProperty({ example: 'Deskripsi Berita', description: 'Deskripsi dari berita' })
  deskripsiBerita: string;

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

  @ApiProperty({ example: 'Deskripsi Berita 2', description: 'Deskripsi tambahan berita (opsional)' })
  deskripsiBerita2?: string;

  @ApiProperty({ example: 'Deskripsi Berita 3', description: 'Deskripsi tambahan berita (opsional)' })
  deskripsiBerita3?: string;

  @ApiProperty({ example: 'Deskripsi Berita 4', description: 'Deskripsi tambahan berita (opsional)' })
  deskripsiBerita4?: string;

  @ApiProperty({ example: 'Deskripsi Berita 5', description: 'Deskripsi tambahan berita (opsional)' })
  deskripsiBerita5?: string;

  @ApiProperty({ example: 'Deskripsi Berita 6', description: 'Deskripsi tambahan berita (opsional)' })
  deskripsiBerita6?: string;

  @ApiProperty({ example: 'Deskripsi Berita 7', description: 'Deskripsi tambahan berita (opsional)' })
  deskripsiBerita7?: string;

  @ApiProperty({ example: 'Deskripsi Berita 8', description: 'Deskripsi tambahan berita (opsional)' })
  deskripsiBerita8?: string;

  @ApiProperty({ example: 'Deskripsi Berita 9', description: 'Deskripsi tambahan berita (opsional)' })
  deskripsiBerita9?: string;

  constructor(data: any) {
    const validatedData = CreateBeritaDtoSchema.parse(data);
    Object.assign(this, validatedData);
  }
}