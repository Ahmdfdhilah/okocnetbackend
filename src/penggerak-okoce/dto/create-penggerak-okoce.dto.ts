import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const CreatePenggerakOkoceSchema = z.object({
    namaPenggerak: z.string().min(1).max(255),
    deskripsiPenggerak: z.string().min(1),
    fotoPenggerak: z.string().min(1),
    publishedAt: z.string().optional(),
});

export class CreatePenggerakOkoceDto {
    @ApiProperty({ example: 'Nama Penggerak' })
    namaPenggerak: string;
    @ApiProperty({ example: 'Deskripsi Penggerak' })
    deskripsiPenggerak: string;
    @ApiProperty({ example: 'file type' })
    fotoPenggerak: string;
    @ApiProperty({ example: '2024-07-03T04:48:57.000Z' })
    publishedAt?: string;

    constructor(data: any) {
        const validatedData = CreatePenggerakOkoceSchema.parse(data);
        this.namaPenggerak = validatedData.namaPenggerak;
        this.deskripsiPenggerak = validatedData.deskripsiPenggerak;
        this.fotoPenggerak = validatedData.fotoPenggerak;
        this.publishedAt = validatedData.publishedAt;
    }
}