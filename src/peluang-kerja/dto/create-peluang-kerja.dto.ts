import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const CreatePeluangKerjaSchema = z.object({
    judulKerja: z.string(),
    lokasiKerja: z.string(),
    fotoKerja: z.string(),
    kategoriKerja: z.string(),
    tentangProgram: z.string(),
    benefitProgram: z.string(),
    jobdescKerja: z.string(),
    kriteriaPeserta: z.string(),
    urlPendaftaran: z.string(),
    sistemKerja: z.enum(['Full-Time', 'Part-Time', 'Contract', 'Volunteer']),
    periodePendaftaran: z.string().optional(),
    publishedAt: z.string(),
});

export class CreatePeluangKerjaDto {
    @ApiProperty({ example: 'Judul Kerja' })
    judulKerja: string;
    @ApiProperty({ example: 'Lokasi Kerja' })
    lokasiKerja: string;
    @ApiProperty({ example: 'file type' })
    fotoKerja: string;
    @ApiProperty({ example: 'Kategori Kerja' })
    kategoriKerja: string;
    @ApiProperty({ example: 'Tentang Program' })
    tentangProgram: string;
    @ApiProperty({ example: 'Benefit Program' })
    benefitProgram: string;
    @ApiProperty({ example: 'Jobdesc Kerja' })
    jobdescKerja: string;
    @ApiProperty({ example: 'Kriteria Peserta' })
    kriteriaPeserta: string;
    @ApiProperty({ example: 'https://pendaftaran-kerja.com' })
    urlPendaftaran: string;
    @ApiProperty({ enum: ['Full-Time', 'Part-Time', 'Contract', 'Volunteer'], example: 'Full-Time' })
    sistemKerja: string;
    @ApiProperty({ example: '2024-07-03T04:48:57.000Z' })
    publishedAt: string;

    constructor(data: any) {
        const validatedData = CreatePeluangKerjaSchema.parse(data);
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