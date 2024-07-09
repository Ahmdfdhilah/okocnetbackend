import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const CreatePeluangUsahaSchema = z.object({
    judulUsaha: z.string(),
    fotoUsaha: z.string(),
    lokasiUsaha: z.string(),
    kategoriUsaha: z.string(),
    tentangProgram: z.string(),
    benefitProgram: z.string(),
    jobdescUsaha: z.string(),
    kriteriaUsaha: z.string(),
    urlPendaftaran: z.string(),
    periodePendaftaran: z.string().optional(),
    publishedAt: z.string(),
});

export class CreatePeluangUsahaDto {
    @ApiProperty({ example: 'Judul Usaha' })
    judulUsaha: string;
    @ApiProperty({ example: 'file type' })
    fotoUsaha: string;
    @ApiProperty({ example: 'Lokasi Usaha' })
    lokasiUsaha: string;
    @ApiProperty({ example: 'Kategori Usaha' })
    kategoriUsaha: string;
    @ApiProperty({ example: 'Tentang Program' })
    tentangProgram: string;
    @ApiProperty({ example: 'Benefit Program' })
    benefitProgram: string;
    @ApiProperty({ example: 'Jobdesc Usaha' })
    jobdescUsaha: string;
    @ApiProperty({ example: 'Kriteria Usaha' })
    kriteriaUsaha: string;
    @ApiProperty({ example: 'https://pendaftaran-usaha.com' })
    urlPendaftaran: string;
    @ApiProperty({ example: '2024-07-03T04:48:57.000Z' })
    publishedAt: string;

    constructor(data: any) {
        const validatedData = CreatePeluangUsahaSchema.parse(data);
        this.judulUsaha = validatedData.judulUsaha;
        this.fotoUsaha = validatedData.fotoUsaha;
        this.lokasiUsaha = validatedData.lokasiUsaha;
        this.kategoriUsaha = validatedData.kategoriUsaha;
        this.tentangProgram = validatedData.tentangProgram;
        this.benefitProgram = validatedData.benefitProgram;
        this.jobdescUsaha = validatedData.jobdescUsaha;
        this.kriteriaUsaha = validatedData.kriteriaUsaha;
        this.urlPendaftaran = validatedData.urlPendaftaran;
        this.publishedAt = validatedData.publishedAt;
    }
}