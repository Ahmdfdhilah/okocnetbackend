import { z } from 'zod';

export const CreateLogoDto = z.object({
    nama: z.string()
});

export type CreateLogoDto = z.infer<typeof CreateLogoDto>;
