import { z } from 'zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const UpdatePenggerakOkoceSchema = z.object({
    namaPenggerak: z.string().min(1).max(255).optional(),
    deskripsiPenggerak: z.string().min(1).optional(),
    fotoPenggerak: z.string().min(1).optional(),
    publishedAt: z.string().optional(),
});

export class UpdatePenggerakOkoceDto {
    @ApiPropertyOptional({ example: 'Nama Penggerak' })
    namaPenggerak?: string;
    @ApiPropertyOptional({ example: 'Deskripsi Penggerak' })
    deskripsiPenggerak?: string;
    @ApiPropertyOptional({ example: 'file type' })
    fotoPenggerak?: string;
    @ApiPropertyOptional({ example: '2024-07-03T04:48:57.000Z' })
    publishedAt?: string;

    constructor(data: any) {
        const validatedData = UpdatePenggerakOkoceSchema.parse(data);
        this.namaPenggerak = validatedData.namaPenggerak;
        this.deskripsiPenggerak = validatedData.deskripsiPenggerak;
        this.fotoPenggerak = validatedData.fotoPenggerak;
        this.publishedAt = validatedData.publishedAt;
    }
}