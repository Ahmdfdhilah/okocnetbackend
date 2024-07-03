import { z } from 'zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const UpdatePeluangUsahaSchema = z.object({
    judulUsaha: z.string().optional(),
    fotoUsaha: z.string().optional(),
    lokasiUsaha: z.string().optional(),
    kategoriUsaha: z.string().optional(),
    tentangProgram: z.string().optional(),
    benefitProgram: z.string().optional(),
    jobdescUsaha: z.string().optional(),
    kriteriaUsaha: z.string().optional(),
    urlPendaftaran: z.string().optional(),
    sistemKerja: z.enum(['Full-Time', 'Part-Time', 'Contract', 'Volunteer']).optional(),
    periodePendaftaran: z.string().optional(),
    publishedAt: z.string().optional(),
});

export class UpdatePeluangUsahaDto {
    @ApiPropertyOptional({ example: 'Judul Usaha' })
    judulUsaha?: string;
    @ApiPropertyOptional({ example: 'file type' })
    fotoUsaha?: string;
    @ApiPropertyOptional({ example: 'Lokasi Usaha' })
    lokasiUsaha?: string;
    @ApiPropertyOptional({ example: 'Kategori Usaha' })
    kategoriUsaha?: string;
    @ApiPropertyOptional({ example: 'Tentang Program' })
    tentangProgram?: string;
    @ApiPropertyOptional({ example: 'Benefit Program' })
    benefitProgram?: string;
    @ApiPropertyOptional({ example: 'Jobdesc Usaha' })
    jobdescUsaha?: string;
    @ApiPropertyOptional({ example: 'Kriteria Usaha' })
    kriteriaUsaha?: string;
    @ApiPropertyOptional({ example: 'https://pendaftaran-usaha.com' })
    urlPendaftaran?: string;
    @ApiPropertyOptional({ enum: ['Full-Time', 'Part-Time', 'Contract', 'Volunteer'], example: 'Full-Time' })
    sistemKerja?: string;
    @ApiPropertyOptional({ example: '2024-07-03T04:48:57.000Z' })
    publishedAt?: string;

    constructor(data: any) {
        const validatedData = UpdatePeluangUsahaSchema.parse(data);
        this.judulUsaha = validatedData.judulUsaha;
        this.fotoUsaha = validatedData.fotoUsaha;
        this.lokasiUsaha = validatedData.lokasiUsaha;
        this.kategoriUsaha = validatedData.kategoriUsaha;
        this.tentangProgram = validatedData.tentangProgram;
        this.benefitProgram = validatedData.benefitProgram;
        this.jobdescUsaha = validatedData.jobdescUsaha;
        this.kriteriaUsaha = validatedData.kriteriaUsaha;
        this.urlPendaftaran = validatedData.urlPendaftaran;
        this.sistemKerja = validatedData.sistemKerja;
        this.publishedAt = validatedData.publishedAt;
    }
}