import { z } from 'zod';

export const CreatePeluangKerjaSchema = z.object({
  judulKerja: z.string(),
  lokasiKerja: z.string(),
  fotoKerja: z.string(),
  kategoriKerja: z.string(),
  tentangProgram: z.string(),
  benefitProgram: z.string(),
  jobdescKerja: z.string(),
  kriteriaPeserta: z.string(),
  urlPendaftaran: z.string(),
  sistemKerja: z.enum(['Full-Time', 'Part-Time', 'Contract', 'Volunteer']),
  periodePendaftaran: z.string().optional(),
  publishedAt: z.string(),
});

export type CreatePeluangKerjaDto = z.infer<typeof CreatePeluangKerjaSchema>;