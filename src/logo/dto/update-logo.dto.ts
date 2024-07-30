import { z } from 'zod';

export const UpdateLogoDto = z.object({
    nama: z.string()
});

export type UpdateLogoDto = z.infer<typeof UpdateLogoDto>;
