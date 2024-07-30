import { z } from 'zod';

export const CreateEmakKeceDtoSchema = z.object({
    nama: z.string().max(255),
});

export type CreateEmakKeceDto = z.infer<typeof CreateEmakKeceDtoSchema>;