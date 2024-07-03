import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const CreatePengurusSchema = z.object({
    namaFounder: z.string(),
    jabatanFounder: z.string(),
    fotoFounder: z.string(),
    publishedAt: z.string(),
});

export class CreatePengurusDto {
    @ApiProperty({ example: 'Nama Founder' })
    namaFounder: string;
    @ApiProperty({ example: 'Jabatan Founder' })
    jabatanFounder: string;
    @ApiProperty({ example: 'file type' })
    fotoFounder: string;
    @ApiProperty({ example: '2024-07-03T04:48:57.000Z' })
    publishedAt: string;

    constructor(data: any) {
        const validatedData = CreatePengurusSchema.parse(data);
        this.namaFounder = validatedData.namaFounder;
        this.jabatanFounder = validatedData.jabatanFounder;
        this.fotoFounder = validatedData.fotoFounder;
        this.publishedAt = validatedData.publishedAt;
    }
}