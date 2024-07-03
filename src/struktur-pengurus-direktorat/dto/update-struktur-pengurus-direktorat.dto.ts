import {z} from 'zod';

export const UpdateStrukturPengurusDirektoratSchema = z.object({
    namaPengurus: z.string().optional(),
    jabatanPengurus: z.string().optional(),
    fotoPengurus: z.string().optional(),
    publishedAt: z.string().optional(),
});

export type UpdateStrukturPengurusDirektoratDto = z.infer<typeof UpdateStrukturPengurusDirektoratSchema>;