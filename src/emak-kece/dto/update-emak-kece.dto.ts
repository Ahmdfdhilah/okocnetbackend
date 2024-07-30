import { z } from 'zod';

export const UpdateEmakKeceDtoSchema = z.object({
    nama: z.string().max(255)
});

export type UpdateEmakKeceDto = z.infer<typeof UpdateEmakKeceDtoSchema>;
