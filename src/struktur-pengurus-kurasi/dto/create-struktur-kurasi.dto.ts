import {z} from 'zod';

export const CreateStrukturPengurusKurasiSchema = z.object({
    namaDewan: z.string(),
    jabatanDewan: z.string(),
    fotoDewan: z.string(),
    publishedAt: z.string(),
});

export type CreateStrukturPengurusKurasiDto = z.infer<typeof CreateStrukturPengurusKurasiSchema>;