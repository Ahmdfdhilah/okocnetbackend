import { z } from 'zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const UpdateMagangSchema = z.object({
  judulMagang: z.string().max(255).optional(),
  lokasiMagang: z.string().max(255).optional(),
  durasiMagang: z.string().max(255).optional(),
  jenisMagang: z.enum(['Hybrid', 'WFO (Work From Office)', 'WFH (Work From Home)']).optional(),
  fotoMagang: z.string().optional(),
  tentangProgram: z.string().optional(),
  benefitMagang: z.string().optional(),
  kriteriaPeserta: z.string().optional(),
  urlMsib: z.string().optional(),
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

export class UpdateMagangDto {
  @ApiPropertyOptional({ example: 'Software Engineer Intern' })
  judulMagang?: string;
  
  @ApiPropertyOptional({ example: 'Jakarta' })
  lokasiMagang?: string;
  
  @ApiPropertyOptional({ example: '3 months' })
  durasiMagang?: string;
  
  @ApiPropertyOptional({ example: 'Hybrid' })
  jenisMagang?: 'Hybrid' | 'WFO (Work From Office)' | 'WFH (Work From Home)';
  
  @ApiPropertyOptional({ example: 'path/to/foto.jpg' })
  fotoMagang?: string;
  
  @ApiPropertyOptional({ example: 'This is a great internship program.' })
  tentangProgram?: string;
  
  @ApiPropertyOptional({ example: 'Competitive salary, Flexible hours' })
  benefitMagang?: string;
  
  @ApiPropertyOptional({ example: 'Final year student, GPA > 3.0' })
  kriteriaPeserta?: string;
  
  @ApiPropertyOptional({ example: 'http://url-msib.com' })
  urlMsib?: string;
  
  @ApiPropertyOptional({ example: 'JavaScript' })
  kompetensi1?: string;
  
  @ApiPropertyOptional({ example: 'Node.js' })
  kompetensi2?: string;
  
  @ApiPropertyOptional({ example: 'React.js' })
  kompetensi3?: string;
  
  @ApiPropertyOptional({ example: 'TypeScript' })
  kompetensi4?: string;
  
  @ApiPropertyOptional({ example: 'GraphQL' })
  kompetensi5?: string;
  
  @ApiPropertyOptional({ example: 'Experience with web development' })
  kriteriaPeserta1?: string;
  
  @ApiPropertyOptional({ example: 'Good communication skills' })
  kriteriaPeserta2?: string;
  
  @ApiPropertyOptional({ example: 'Ability to work in a team' })
  kriteriaPeserta3?: string;
  
  @ApiPropertyOptional({ example: 'Problem-solving skills' })
  kriteriaPeserta4?: string;
  
  @ApiPropertyOptional({ example: 'Adaptability' })
  kriteriaPeserta5?: string;
  
  @ApiPropertyOptional({ example: 'Self-motivation' })
  kriteriaPeserta6?: string;
  
  @ApiPropertyOptional({ example: 'Time management' })
  kriteriaPeserta7?: string;
  
  @ApiPropertyOptional({ example: 'Attention to detail' })
  kriteriaPeserta8?: string;
  
  @ApiPropertyOptional({ example: 'Positive attitude' })
  kriteriaPeserta9?: string;
  
  @ApiPropertyOptional({ example: 'Leadership skills' })
  kriteriaPeserta10?: string;
  
  @ApiPropertyOptional({ example: '2024-07-03T04:48:57.000Z', nullable: true })
  publishedAt?: string;

  constructor(data: any) {
    const validatedData = UpdateMagangSchema.parse(data);
    Object.assign(this, validatedData);
  }
}
