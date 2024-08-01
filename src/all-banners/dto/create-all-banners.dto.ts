import { z } from 'zod';

const BannerNames = [
    'Sejarah',
    'Visi Misi',
    'Nilai Inti',
    'Struktur Pengurus',
    'Penggerak',
    'Anniversary',
    '7 Top',
    'Merchandise',
    'Peluang Usaha',
    'Peluang Kerja',
    'Magang',
    'Trainer',
    'Mentor',
    'Mitra Kerjasama',
    'Donasi',
    'Event',
    'Berita',
    'Brand Lokal',
    'Modal Berkah',
    'Emak Kece',
    'Masjid Pemberdaya',
    'Desapreneur',
    'The Mentor',
    'Master Mentor',
    'Testimoni'
] as const;

export const CreateAllBannerSchema = z.object({
    nama: z.enum(BannerNames, { required_error: 'Nama is required' })
});

export type CreateAllBannerDto = z.infer<typeof CreateAllBannerSchema>;