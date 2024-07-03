import { z } from 'zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const UpdatePeluangKerjaSchema = z.object({
    judulKerja: z.string().optional(),
    lokasiKerja: z.string().optional(),
    fotoKerja: z.string().optional(),
    kategoriKerja: z.string().optional(),
    tentangProgram: z.string().optional(),
    benefitProgram: z.string().optional(),
    jobdescKerja: z.string().optional(),
    kriteriaPeserta: z.string().optional(),
    urlPendaftaran: z.string().optional(),
    sistemKerja: z.enum(['Full-Time', 'Part-Time', 'Contract', 'Volunteer']).optional(),
    periodePendaftaran: z.string().optional(),
    publishedAt: z.string().optional(),
});

export class UpdatePeluangKerjaDto {
    @ApiPropertyOptional({ example: 'Judul Kerja' })
    judulKerja?: string;
    @ApiPropertyOptional({ example: 'Lokasi Kerja' })
    lokasiKerja?: string;
    @ApiPropertyOptional({ example: 'file type' })
    fotoKerja?: string;
    @ApiPropertyOptional({ example: 'Kategori Kerja' })
    kategoriKerja?: string;
    @ApiPropertyOptional({ example: 'Tentang Program' })
    tentangProgram?: string;
    @ApiPropertyOptional({ example: 'Benefit Program' })
    benefitProgram?: string;
    @ApiPropertyOptional({ example: 'Jobdesc Kerja' })
    jobdescKerja?: string;
    @ApiPropertyOptional({ example: 'Kriteria Peserta' })
    kriteriaPeserta?: string;
    @ApiPropertyOptional({ example: 'https://pendaftaran-kerja.com' })
    urlPendaftaran?: string;
    @ApiPropertyOptional({ enum: ['Full-Time', 'Part-Time', 'Contract', 'Volunteer'], example: 'Full-Time' })
    sistemKerja?: string;
    @ApiPropertyOptional({ example: '2024-07-03T04:48:57.000Z' })
    publishedAt?: string;

    constructor(data: any) {
        const validatedData = UpdatePeluangKerjaSchema.parse(data);
        this.judulKerja = validatedData.judulKerja;
        this.lokasiKerja = validatedData.lokasiKerja;
        this.fotoKerja = validatedData.fotoKerja;
        this.kategoriKerja = validatedData.kategoriKerja;
        this.tentangProgram = validatedData.tentangProgram;
        this.benefitProgram = validatedData.benefitProgram;
        this.jobdescKerja = validatedData.jobdescKerja;
        this.kriteriaPeserta = validatedData.kriteriaPeserta;
        this.urlPendaftaran = validatedData.urlPendaftaran;
        this.sistemKerja = validatedData.sistemKerja;
        this.publishedAt = validatedData.publishedAt;
    }
}