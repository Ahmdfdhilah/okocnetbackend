import {z} from 'zod';

export const UpdateStrukturPengurusHarianSchema = z.object({
    namaPengurus: z.string().optional(),
    jabatanPengurus: z.string().optional(),
    fotoPengurus: z.string().optional(),
    publishedAt: z.string().optional(),
});

export type UpdateStrukturPengurusHarianDto = z.infer<typeof UpdateStrukturPengurusHarianSchema>;