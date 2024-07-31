import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const CreateStrukturPengurusSchema = z.object({
    nama: z.string(),
    jabatan: z.string(),
    foto: z.string(),
    publishedAt: z.string(),
    tipe: z.enum(['founder', 'eksekutif', 'harian', 'kurasi', 'pembina', 'direktorat']),
});

export class CreateStrukturPengurusDto {
    @ApiProperty({ example: 'John Doe' })
    nama: string;

    @ApiProperty({ example: 'Director' })
    jabatan: string;

    @ApiProperty({ example: 'file type' })
    foto: string;

    @ApiProperty({ example: '2024-07-03T04:48:57.000Z' })
    publishedAt: string;

    @ApiProperty({ example: 'eksekutif' })
    tipe: 'founder' | 'eksekutif' | 'harian' | 'kurasi' | 'pembina' | 'direktorat';

    constructor(data: any) {
        const validatedData = CreateStrukturPengurusSchema.parse(data);
        this.nama = validatedData.nama;
        this.jabatan = validatedData.jabatan;
        this.foto = validatedData.foto;
        this.publishedAt = validatedData.publishedAt;
        this.tipe = validatedData.tipe;
    }
}