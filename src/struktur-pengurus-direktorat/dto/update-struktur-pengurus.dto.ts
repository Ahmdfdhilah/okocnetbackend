import { z } from 'zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const UpdateStrukturPengurusSchema = z.object({
    nama: z.string().max(255).optional(),
    jabatan: z.string().max(255).optional(),
    foto: z.string().optional(),
    publishedAt: z.string().optional(),
    tipe: z.enum(['founder', 'eksekutif', 'harian', 'kurasi', 'pembina', 'direktorat']).optional(),
});

export class UpdateStrukturPengurusDto {
    @ApiPropertyOptional({ example: 'John Doe' })
    nama?: string;

    @ApiPropertyOptional({ example: 'Director' })
    jabatan?: string;

    @ApiPropertyOptional({ example: 'file type' })
    foto?: string;

    @ApiPropertyOptional({ example: '2024-07-03T04:48:57.000Z' })
    publishedAt?: string;

    @ApiPropertyOptional({ example: 'eksekutif' })
    tipe?: 'founder' | 'eksekutif' | 'harian' | 'kurasi' | 'pembina'|  'direktorat';

    constructor(data: any) {
        const validatedData = UpdateStrukturPengurusSchema.parse(data);
        this.nama = validatedData.nama;
        this.jabatan = validatedData.jabatan;
        this.foto = validatedData.foto;
        this.publishedAt = validatedData.publishedAt;
        this.tipe = validatedData.tipe;
    }
}
