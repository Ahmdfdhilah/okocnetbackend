import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const CreateStrukturPengurusEksekutifSchema = z.object({
    namaPengurus: z.string(),
    jabatanPengurus: z.string(),
    fotoPengurus: z.string(),
    publishedAt: z.string(),
});

export class CreateStrukturPengurusEksekutifDto {
    @ApiProperty({ example: 'Ami' })
    namaPengurus: string;
    @ApiProperty({ example: 'Dir' })
    jabatanPengurus: string;
    @ApiProperty({ example: 'file type' })
    fotoPengurus: string;
    @ApiProperty({ example: '2024-07-03T04:48:57.000Z' })
    publishedAt: string;

    constructor(data: any) {
        const validatedData = CreateStrukturPengurusEksekutifSchema.parse(data);
        this.namaPengurus = validatedData.namaPengurus;
        this.jabatanPengurus = validatedData.jabatanPengurus;
        this.fotoPengurus = validatedData.fotoPengurus;
        this.publishedAt = validatedData.publishedAt;
    }
}
