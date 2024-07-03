import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const createBrandLokalSchema = z.object({
  judulBrand: z.string(),
  deskripsiBrand: z.string(),
  fotoBrand: z.string(),
  publishedAt: z.string(),
});

export class CreateBrandLokalDto {
  @ApiProperty({ example: 'Brand Lokal' })
  judulBrand: string;

  @ApiProperty({ example: 'Deskripsi Brand Lokal' })
  deskripsiBrand: string;

  @ApiProperty({ example: 'path/to/foto.jpg' })
  fotoBrand: string;

  @ApiProperty({ example: '2024-07-03T04:48:57.000Z' })
  publishedAt: string;

  constructor(data: any) {
    const validatedData = createBrandLokalSchema.parse(data);
    Object.assign(this, validatedData);
  }
}
