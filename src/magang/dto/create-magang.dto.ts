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
  kriteriaPeserta: z.string(),
  urlMsib: z.string(),
  kompetensi1: z.string().nullable().optional(),
  kompetensi2: z.string().nullable().optional(),
  kompetensi3: z.string().nullable().optional(),
  kompetensi4: z.string().nullable().optional(),
  kompetensi5: z.string().nullable().optional(),
  kriteriaPeserta1: z.string().nullable().optional(),
  kriteriaPeserta2: z.string().nullable().optional(),
  kriteriaPeserta3: z.string().nullable().optional(),
  kriteriaPeserta4: z.string().nullable().optional(),
  kriteriaPeserta5: z.string().nullable().optional(),
  kriteriaPeserta6: z.string().nullable().optional(),
  kriteriaPeserta7: z.string().nullable().optional(),
  kriteriaPeserta8: z.string().nullable().optional(),
  kriteriaPeserta9: z.string().nullable().optional(),
  kriteriaPeserta10: z.string().nullable().optional(),
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
  
  @ApiProperty({ example: 'Final year student, GPA > 3.0' })
  kriteriaPeserta: string;
  
  @ApiProperty({ example: 'http://url-msib.com' })
  urlMsib: string;
  
  @ApiProperty({ example: 'JavaScript' })
  kompetensi1?: string;
  
  @ApiProperty({ example: 'Node.js' })
  kompetensi2?: string;
  
  @ApiProperty({ example: 'React.js' })
  kompetensi3?: string;
  
  @ApiProperty({ example: 'TypeScript' })
  kompetensi4?: string;
  
  @ApiProperty({ example: 'GraphQL' })
  kompetensi5?: string;
  
  @ApiProperty({ example: 'Experience with web development' })
  kriteriaPeserta1?: string;
  
  @ApiProperty({ example: 'Good communication skills' })
  kriteriaPeserta2?: string;
  
  @ApiProperty({ example: 'Ability to work in a team' })
  kriteriaPeserta3?: string;
  
  @ApiProperty({ example: 'Problem-solving skills' })
  kriteriaPeserta4?: string;
  
  @ApiProperty({ example: 'Adaptability' })
  kriteriaPeserta5?: string;
  
  @ApiProperty({ example: 'Self-motivation' })
  kriteriaPeserta6?: string;
  
  @ApiProperty({ example: 'Time management' })
  kriteriaPeserta7?: string;
  
  @ApiProperty({ example: 'Attention to detail' })
  kriteriaPeserta8?: string;
  
  @ApiProperty({ example: 'Positive attitude' })
  kriteriaPeserta9?: string;
  
  @ApiProperty({ example: 'Leadership skills' })
  kriteriaPeserta10?: string;
  
  @ApiProperty({ example: '2024-07-03T04:48:57.000Z', nullable: true })
  publishedAt?: string;

  constructor(data: any) {
    const validatedData = CreateMagangSchema.parse(data);
    Object.assign(this, validatedData);
  }
}