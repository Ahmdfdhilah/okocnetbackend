import { z } from 'zod';

export const UpdateSosmedDto = z.object({
    link: z.optional(z.string()),
    nama: z.optional(z.enum(['whatsapp', 'instagram', 'twitter', 'facebook', 'tiktok', 'youtube'])),
    publishedAt: z.optional(z.date()),
});

export type UpdateSosmedDto = z.infer<typeof UpdateSosmedDto>;