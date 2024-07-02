import { z } from 'zod';

export const UpdatePeluangKerjaSchema = z.object({
  judulKerja: z.string().optional(),
  lokasiKerja: z.string().optional(),
  fotoKerja: z.string().optional(),
  kategoriKerja: z.string().optional(),
  tentangProgram: z.string().optional(),
  benefitProgram: z.string().optional(),
  jobdescKerja: z.string().optional(),
  kriteriaPeserta: z.string().optional(),
  urlPendaftaran: z.string().optional(),
  sistemKerja: z.enum(['Full-Time', 'Part-Time', 'Contract', 'Volunteer']).optional(),
  periodePendaftaran: z.string().optional(),
  publishedAt: z.string().optional(),
});

export type UpdatePeluangKerjaDto = z.infer<typeof UpdatePeluangKerjaSchema>;