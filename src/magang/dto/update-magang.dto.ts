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
  kriteriaPeserta: z.array(z.string()).optional(),
  urlMsib: z.string().optional(),
  kompetensi: z.array(z.string()).optional(),
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
  
  @ApiPropertyOptional({ type: [String], example: ['Final year student', 'GPA > 3.0'] })
  kriteriaPeserta?: string[];
  
  @ApiPropertyOptional({ type: [String], example: ['JavaScript', 'Node.js', 'React.js', 'TypeScript', 'GraphQL'] })
  kompetensi?: string[];
  
  @ApiPropertyOptional({ example: 'http://url-msib.com' })
  urlMsib?: string;
  
  @ApiPropertyOptional({ example: '2024-07-03T04:48:57.000Z', nullable: true })
  publishedAt?: string;

  constructor(data: any) {
    const validatedData = UpdateMagangSchema.parse(data);
    Object.assign(this, validatedData);
  }
}
