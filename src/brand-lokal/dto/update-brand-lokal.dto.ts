import { z } from 'zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const updateBrandLokalSchema = z.object({
  judulBrand: z.string().optional(),
  deskripsiBrand: z.string().optional(),
  fotoBrand: z.string().optional(),
  publishedAt: z.date().optional(),
});

export class UpdateBrandLokalDto {
  @ApiPropertyOptional({ example: 'Brand Lokal' })
  judulBrand?: string;

  @ApiPropertyOptional({ example: 'Deskripsi Brand Lokal' })
  deskripsiBrand?: string;

  @ApiPropertyOptional({ example: 'path/to/foto.jpg' })
  fotoBrand?: string;

  @ApiPropertyOptional({ example: '2024-07-03T04:48:57.000Z' })
  publishedAt?: Date;

  constructor(data: any) {
    const validatedData = updateBrandLokalSchema.parse(data);
    Object.assign(this, validatedData);
  }
}
