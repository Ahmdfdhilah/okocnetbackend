import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const CreateMagangSchema = z.object({
  judulMagang: z.string().max(255),
  lokasiMagang: z.string().max(255),
  durasiMagang: z.string().max(255),
  jenisMagang: z.enum(['Hybrid', 'WFO (Work From Office)', 'WFH (Work From Home)']),
  fotoMagang: z.string(),
  tentangProgram: z.string(),
  benefitMagang: z.string(),
  kriteriaPeserta: z.array(z.string()),
  urlMsib: z.string(),
  kompetensi: z.array(z.string()).optional(),
  publishedAt: z.string().nullable().optional(),
});

export class CreateMagangDto {
  @ApiProperty({ example: 'Software Engineer Intern' })
  judulMagang: string;
  
  @ApiProperty({ example: 'Jakarta' })
  lokasiMagang: string;
  
  @ApiProperty({ example: '3 months' })
  durasiMagang: string;
  
  @ApiProperty({ example: 'Hybrid' })
  jenisMagang: 'Hybrid' | 'WFO (Work From Office)' | 'WFH (Work From Home)';
  
  @ApiProperty({ example: 'path/to/foto.jpg' })
  fotoMagang: string;
  
  @ApiProperty({ example: 'This is a great internship program.' })
  tentangProgram: string;
  
  @ApiProperty({ example: 'Competitive salary, Flexible hours' })
  benefitMagang: string;
  
  @ApiProperty({ type: [String], example: ['Final year student', 'GPA > 3.0'] })
  kriteriaPeserta: string[];
  
  @ApiProperty({ example: 'http://url-msib.com' })
  urlMsib: string;
  
  @ApiProperty({ type: [String], example: ['JavaScript', 'Node.js', 'React.js'] })
  kompetensi?: string[];
  
  @ApiProperty({ example: '2024-07-03T04:48:57.000Z', nullable: true })
  publishedAt?: string;

  constructor(data: any) {
    const validatedData = CreateMagangSchema.parse(data);
    Object.assign(this, validatedData);
  }
}
