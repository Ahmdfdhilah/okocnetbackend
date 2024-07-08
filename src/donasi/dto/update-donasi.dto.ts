import { z } from 'zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const UpdateDonasiSchema = z.object({
  judulDonasi: z.string().optional(),
  deskripsiDonasi: z.string().optional(),
  fotoDonasi: z.string().optional(),
  publishedAt: z.date(),
});

export class UpdateDonasiDto {
  @ApiPropertyOptional({ example: 'Bantuan Bencana' })
  judulDonasi?: string;

  @ApiPropertyOptional({ example: 'Bantuan untuk korban bencana alam' })
  deskripsiDonasi?: string;

  @ApiPropertyOptional({ example: 'path/to/foto.jpg' })
  fotoDonasi?: string;

  @ApiPropertyOptional({ example: '2024-07-03T04:48:57.000Z' })
  publishedAt?: Date;

  constructor(data: any) {
    const validatedData = UpdateDonasiSchema.parse(data);
    Object.assign(this, validatedData);
  }
}
