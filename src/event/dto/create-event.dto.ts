import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const CreateEventSchema = z.object({
  judulEvent: z.string().min(1).max(255),
  tanggalEvent: z.string(),
  hargaEvent: z.string().min(1).max(255),
  pointEvent: z.string().min(1).max(255),
  fotoEvent: z.string().min(1),
  urlPendaftaran: z.string().min(1),
  deskripsiEvent: z.string().min(1),
  tempatEvent: z.string().min(1),
  quotaEvent: z.string().min(1).max(255),
  durasiEvent: z.string().min(1).max(255),
  narasumber: z.string().min(1),
  contactPerson: z.string().min(1).max(255),
  publishedAt: z.string(),
});

export class CreateEventDto {
  @ApiProperty({ example: 'Coding Bootcamp' })
  judulEvent: string;

  @ApiProperty({ example: '2024-07-10' })
  tanggalEvent: string;

  @ApiProperty({ example: '100000' })
  hargaEvent: string;

  @ApiProperty({ example: '10' })
  pointEvent: string;

  @ApiProperty({ example: 'path/to/foto.jpg' })
  fotoEvent: string;

  @ApiProperty({ example: 'http://url-pendaftaran.com' })
  urlPendaftaran: string;

  @ApiProperty({ example: 'Learn to code in 10 days' })
  deskripsiEvent: string;

  @ApiProperty({ example: 'Jakarta' })
  tempatEvent: string;

  @ApiProperty({ example: '100' })
  quotaEvent: string;

  @ApiProperty({ example: '2 hours' })
  durasiEvent: string;

  @ApiProperty({ example: 'John Doe' })
  narasumber: string;

  @ApiProperty({ example: 'Detailed description 2' })
  deskripsiEvent2?: string;

  @ApiProperty({ example: 'Detailed description 3' })
  deskripsiEvent3?: string;

  @ApiProperty({ example: 'Detailed description 4' })
  deskripsiEvent4?: string;

  @ApiProperty({ example: 'Detailed description 5' })
  deskripsiEvent5?: string;

  @ApiProperty({ example: 'Detailed description 6' })
  deskripsiEvent6?: string;

  @ApiProperty({ example: '08123456789' })
  contactPerson: string;

  @ApiProperty({ example: '2024-07-03T04:48:57.000Z' })
  publishedAt: string;

  constructor(data: any) {
    const validatedData = CreateEventSchema.parse(data);
    Object.assign(this, validatedData);
  }
}