import {z} from 'zod';

export const UpdateStrukturPengurusPembinaSchema = z.object({
    namaPembina: z.string().optional(),
    jabatanPembina: z.string().optional(),
    fotoPembina: z.string().optional(),
    publishedAt: z.string().optional(),
});

export type UpdateStrukturPengurusPembinaDto = z.infer<typeof UpdateStrukturPengurusPembinaSchema>;