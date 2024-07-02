import { z } from 'zod';

export const UpdateEventSchema = z.object({
    judulEvent: z.string().min(1).max(255).optional(),
    tanggalEvent: z.string().optional(), 
    hargaEvent: z.string().min(1).max(255).optional(),
    pointEvent: z.string().min(1).max(255).optional(),
    fotoEvent: z.string().min(1).optional(), 
    urlPendaftaran: z.string().min(1).optional(),
    deskripsiEvent: z.string().min(1).optional(),
    tempatEvent: z.string().min(1).optional(),
    quotaEvent: z.string().min(1).max(255).optional(),
    durasiEvent: z.string().min(1).max(255).optional(),
    narasumber: z.string().min(1).optional(),
    deskripsiEvent2: z.string().optional(),
    deskripsiEvent3: z.string().optional(),
    deskripsiEvent4: z.string().optional(),
    deskripsiEvent5: z.string().optional(),
    deskripsiEvent6: z.string().optional(),
    contactPerson: z.string().min(1).max(255).optional(),
});

export type UpdateEventDto = z.infer<typeof UpdateEventSchema>;