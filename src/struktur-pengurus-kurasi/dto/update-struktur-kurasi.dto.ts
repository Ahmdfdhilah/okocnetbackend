import {z} from 'zod';

export const UpdateStrukturPengurusKurasiSchema = z.object({
    namaDewan: z.string().optional(),
    jabatanDewan: z.string().optional(),
    fotoDewan: z.string().optional(),
    publishedAt: z.string().optional(),
});

export type UpdateStrukturPengurusKurasiDto = z.infer<typeof UpdateStrukturPengurusKurasiSchema>;