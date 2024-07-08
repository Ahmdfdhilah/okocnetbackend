import { z } from 'zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const UpdateEventSchema = z.object({
  judulEvent: z.string().min(1).max(255).optional(),
  tanggalEvent: z.string().optional(),
  hargaEvent: z.string().min(1).max(255).optional(),
  pointEvent: z.string().min(1).max(255).optional(),
  fotoEvent: z.string().min(1).optional(),
  urlPendaftaran: z.string().min(1).optional(),
  deskripsiEvent: z.array(z.string()),
  tempatEvent: z.string().min(1).optional(),
  quotaEvent: z.string().min(1).max(255).optional(),
  durasiEvent: z.string().min(1).max(255).optional(),
  narasumber: z.string().min(1).optional(),
  contactPerson: z.string().min(1).max(255).optional(),
  publishedAt: z.date().optional(),
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
  
  deskripsiEvent?: string[];

  @ApiPropertyOptional({ example: 'Jakarta' })
  tempatEvent?: string;

  @ApiPropertyOptional({ example: '100' })
  quotaEvent?: string;

  @ApiPropertyOptional({ example: '2 hours' })
  durasiEvent?: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  narasumber?: string;

  @ApiPropertyOptional({ example: '08123456789' })
  contactPerson?: string;

  @ApiPropertyOptional({ example: '2024-07-03T04:48:57.000Z' })
  publishedAt?: Date;

  constructor(data: any) {
    const validatedData = UpdateEventSchema.parse(data);
    Object.assign(this, validatedData);
  }
}