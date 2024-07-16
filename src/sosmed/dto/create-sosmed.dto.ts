import { z } from 'zod';

export const CreateSosmedDto = z.object({
    link: z.string(),
    nama: z.enum(['whatsapp', 'instagram', 'twitter', 'facebook', 'tiktok']),
    publishedAt: z.optional(z.date()),
});

export type CreateSosmedDto = z.infer<typeof CreateSosmedDto>;