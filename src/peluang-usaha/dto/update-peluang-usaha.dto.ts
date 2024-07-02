import { z } from 'zod';

export const UpdatePeluangUsahaSchema = z.object({
    judulUsaha: z.string().optional(),
    fotoUsaha: z.string().optional(),
    lokasiUsaha: z.string().optional(),
    kategoriUsaha: z.string().optional(),
    tentangProgram: z.string().optional(),
    benefitProgram: z.string().optional(),
    jobdescUsaha: z.string().optional(),
    kriteriaUsaha: z.string().optional(),
    urlPendaftaran: z.string().optional(),
    sistemKerja: z.enum(['Full-Time', 'Part-Time', 'Contract', 'Volunteer']).optional(),
    periodePendaftaran: z.string().optional(),
    publishedAt: z.string().optional(),
});

export type UpdatePeluangUsahaDto = z.infer<typeof UpdatePeluangUsahaSchema>;