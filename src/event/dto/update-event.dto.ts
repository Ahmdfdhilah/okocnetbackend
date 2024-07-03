import { z } from 'zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const UpdateEventSchema = z.object({
  judulEvent: z.string().min(1).max(255).optional(),
  tanggalEvent: z.string().optional(),
  hargaEvent: z.string().min(1).max(255).optional(),
  pointEvent: z.string().min(1).max(255).optional(),
  fotoEvent: z.string().min(1).optional(),
  urlPendaftaran: z.string().min(1).optional(),
  deskripsiEvent: z.string().min(1).optional(),
  tempatEvent: z.string().min(1).optional(),
  quotaEvent: z.string().min(1).max(255).optional(),
  durasiEvent: z.string().min(1).max(255).optional(),
  narasumber: z.string().min(1).optional(),
  deskripsiEvent2: z.string().optional(),
  deskripsiEvent3: z.string().optional(),
  deskripsiEvent4: z.string().optional(),
  deskripsiEvent5: z.string().optional(),
  deskripsiEvent6: z.string().optional(),
  contactPerson: z.string().min(1).max(255).optional(),
  publishedAt: z.string().optional(),
});

export class UpdateEventDto {
  @ApiPropertyOptional({ example: 'Coding Bootcamp' })
  judulEvent?: string;

  @ApiPropertyOptional({ example: '2024-07-10' })
  tanggalEvent?: string;

  @ApiPropertyOptional({ example: '100000' })
  hargaEvent?: string;

  @ApiPropertyOptional({ example: '10' })
  pointEvent?: string;

  @ApiPropertyOptional({ example: 'path/to/foto.jpg' })
  fotoEvent?: string;

  @ApiPropertyOptional({ example: 'http://url-pendaftaran.com' })
  urlPendaftaran?: string;

  @ApiPropertyOptional({ example: 'Learn to code in 10 days' })
  deskripsiEvent?: string;

  @ApiPropertyOptional({ example: 'Jakarta' })
  tempatEvent?: string;

  @ApiPropertyOptional({ example: '100' })
  quotaEvent?: string;

  @ApiPropertyOptional({ example: '2 hours' })
  durasiEvent?: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  narasumber?: string;

  @ApiPropertyOptional({ example: 'Detailed description 2' })
  deskripsiEvent2?: string;

  @ApiPropertyOptional({ example: 'Detailed description 3' })
  deskripsiEvent3?: string;

  @ApiPropertyOptional({ example: 'Detailed description 4' })
  deskripsiEvent4?: string;

  @ApiPropertyOptional({ example: 'Detailed description 5' })
  deskripsiEvent5?: string;

  @ApiPropertyOptional({ example: 'Detailed description 6' })
  deskripsiEvent6?: string;

  @ApiPropertyOptional({ example: '08123456789' })
  contactPerson?: string;

  @ApiPropertyOptional({ example: '2024-07-03T04:48:57.000Z' })
  publishedAt?: string;

  constructor(data: any) {
    const validatedData = UpdateEventSchema.parse(data);
    Object.assign(this, validatedData);
  }
}