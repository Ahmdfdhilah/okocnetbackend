import { z } from 'zod';

export const UpdateSosmedDto = z.object({
    link: z.optional(z.string()),
    nama: z.optional(z.string()),
    publishedAt: z.optional(z.date()),
});

export type UpdateSosmedDto = z.infer<typeof UpdateSosmedDto>;