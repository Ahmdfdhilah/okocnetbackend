import { z } from 'zod';

export const UpdateDonasiSchema = z.object({
    judulDonasi: z.string().optional(),
    deskripsiDonasi: z.string().optional(),
    fotoDonasi: z.string().optional(),
    publishedAt: z.string(),
})

export type UpdateDonasiDto = z.infer<typeof UpdateDonasiSchema>;