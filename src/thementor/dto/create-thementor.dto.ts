import { z } from 'zod';

export const CreateThementorSchema = z.object({
  judul: z.string(),
  deskripsi: z.array(z.string()),  
  dokumentasi: z.array(z.string()).optional(), 
});

export type CreateThementorDto = z.infer<typeof CreateThementorSchema>;