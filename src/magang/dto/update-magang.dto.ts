import { z } from 'zod';

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

export type UpdateMagangDto = z.infer<typeof UpdateMagangSchema>;