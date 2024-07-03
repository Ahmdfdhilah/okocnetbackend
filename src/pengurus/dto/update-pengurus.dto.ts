import { z } from 'zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const UpdatePengurusSchema = z.object({
    namaFounder: z.string().optional(),
    jabatanFounder: z.string().optional(),
    fotoFounder: z.string().optional(),
    publishedAt: z.string().optional(),
});

export class UpdatePengurusDto {
    @ApiPropertyOptional({ example: 'Nama Founder' })
    namaFounder?: string;
    @ApiPropertyOptional({ example: 'Jabatan Founder' })
    jabatanFounder?: string;
    @ApiPropertyOptional({ example: 'file type' })
    fotoFounder?: string;
    @ApiPropertyOptional({ example: '2024-07-03T04:48:57.000Z' })
    publishedAt?: string;

    constructor(data: any) {
        const validatedData = UpdatePengurusSchema.parse(data);
        this.namaFounder = validatedData.namaFounder;
        this.jabatanFounder = validatedData.jabatanFounder;
        this.fotoFounder = validatedData.fotoFounder;
        this.publishedAt = validatedData.publishedAt;
    }
}