import { z } from 'zod';

export const CreatePeluangUsahaSchema = z.object({
    judulUsaha: z.string(),
    fotoUsaha: z.string(),
    lokasiUsaha: z.string(),
    kategoriUsaha: z.string(),
    tentangProgram: z.string(),
    benefitProgram: z.string(),
    jobdescUsaha: z.string(),
    kriteriaUsaha: z.string(),
    urlPendaftaran: z.string(),
    sistemKerja: z.enum(['Full-Time', 'Part-Time', 'Contract', 'Volunteer']),
    periodePendaftaran: z.string().optional(),
    publishedAt: z.string(),
});

export type CreatePeluangUsahaDto = z.infer<typeof CreatePeluangUsahaSchema>;