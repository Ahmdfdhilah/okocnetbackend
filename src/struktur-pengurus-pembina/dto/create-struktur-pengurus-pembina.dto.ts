import {z} from 'zod';

export const CreateStrukturPengurusKurasiSchema = z.object({
    namaPembina: z.string(),
    jabatanPembina: z.string(),
    fotoPembina: z.string(),
    publishedAt: z.string(),
});

export type CreateStrukturPengurusPembinaDto = z.infer<typeof CreateStrukturPengurusKurasiSchema>;