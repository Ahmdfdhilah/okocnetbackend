import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const CreateDonasiSchema = z.object({
  judulDonasi: z.string(),
  deskripsiDonasi: z.string(),
  fotoDonasi: z.string(),
  publishedAt: z.string(),
});

export class CreateDonasiDto {
  @ApiProperty({ example: 'Bantuan Bencana' })
  judulDonasi: string;

  @ApiProperty({ example: 'Bantuan untuk korban bencana alam' })
  deskripsiDonasi: string;

  @ApiProperty({ example: 'path/to/foto.jpg' })
  fotoDonasi: string;

  @ApiProperty({ example: '2024-07-03T04:48:57.000Z' })
  publishedAt: string;

  constructor(data: any) {
    const validatedData = CreateDonasiSchema.parse(data);
    Object.assign(this, validatedData);
  }
}
