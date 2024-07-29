import { z } from 'zod';

export const UpdateThementorSchema = z.object({
  judul: z.string().optional(),
  deskripsi: z.array(z.string()).optional(),
  dokumentasi: z.array(z.string()).optional(), 
  existingDokumentasi: z.array(z.string()).optional(),  
});

export type UpdateThementorDto = z.infer<typeof UpdateThementorSchema>;
