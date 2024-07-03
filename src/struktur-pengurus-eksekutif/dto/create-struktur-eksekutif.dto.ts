import {z} from 'zod';

export const CreateStrukturPengurusEksekutifSchema = z.object({
    namaPengurus: z.string(),
    jabatanPengurus: z.string(),
    fotoPengurus: z.string(),
    publishedAt: z.string(),
});

export type CreateStrukturPengurusDirektoratDto = z.infer<typeof CreateStrukturPengurusEksekutifSchema>;