import {z} from 'zod';

export const CreateStrukturPengurusDirektoratSchema = z.object({
    namaPengurus: z.string(),
    jabatanPengurus: z.string(),
    fotoPengurus: z.string(),
    publishedAt: z.string(),
});

export type CreateStrukturPengurusDirektoratDto = z.infer<typeof CreateStrukturPengurusDirektoratSchema>;