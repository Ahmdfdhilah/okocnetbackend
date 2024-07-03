import {z} from 'zod';

export const CreateStrukturPengurusHarianSchema = z.object({
    namaPengurus: z.string(),
    jabatanPengurus: z.string(),
    fotoPengurus: z.string(),
    publishedAt: z.string(),
});

export type CreateStrukturPengurusHarianDto = z.infer<typeof CreateStrukturPengurusHarianSchema>;