import { z } from 'zod';

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

export type CreateMagangDto = z.infer<typeof CreateMagangSchema>;