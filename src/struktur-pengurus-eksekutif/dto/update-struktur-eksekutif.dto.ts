import {z} from 'zod';

export const UpdateStrukturPengurusEksekutifSchema = z.object({
    namaPengurus: z.string().optional(),
    jabatanPengurus: z.string().optional(),
    fotoPengurus: z.string().optional(),
    publishedAt: z.string().optional(),
});

export type UpdateStrukturPengurusEksekutifDto = z.infer<typeof UpdateStrukturPengurusEksekutifSchema>;