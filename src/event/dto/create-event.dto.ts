import { z } from 'zod';

export const CreateEventSchema = z.object({
    judulEvent: z.string().min(1).max(255),
    tanggalEvent: z.string(),
    hargaEvent: z.string().min(1).max(255),
    pointEvent: z.string().min(1).max(255),
    fotoEvent: z.string().min(1), 
    urlPendaftaran: z.string().min(1),
    deskripsiEvent: z.string().min(1),
    tempatEvent: z.string().min(1),
    quotaEvent: z.string().min(1).max(255),
    durasiEvent: z.string().min(1).max(255),
    narasumber: z.string().min(1),
    deskripsiEvent2: z.string().optional(),
    deskripsiEvent3: z.string().optional(),
    deskripsiEvent4: z.string().optional(),
    deskripsiEvent5: z.string().optional(),
    deskripsiEvent6: z.string().optional(),
    contactPerson: z.string().min(1).max(255),
    publishedAt: z.string(),
});

export type CreateEventDto = z.infer<typeof CreateEventSchema>;