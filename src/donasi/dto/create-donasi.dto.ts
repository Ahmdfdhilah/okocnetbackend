import { z } from 'zod';

export const CreateDonasiSchema = z.object({
    judulDonasi: z.string(),
    deskripsiDonasi: z.string(),
    fotoDonasi: z.string(),
    publishedAt: z.string(),
})

export type CreateDonasiDto = z.infer<typeof CreateDonasiSchema>;