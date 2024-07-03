import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const CreateStrukturPengurusPembinaSchema = z.object({
    namaPembina: z.string(),
    jabatanPembina: z.string(),
    fotoPembina: z.string(),
    publishedAt: z.string(),
});

export class CreateStrukturPengurusPembinaDto {
    @ApiProperty({ example: 'Ami' })
    namaPembina: string;
    @ApiProperty({ example: 'Dir' })
    jabatanPembina: string;
    @ApiProperty({ example: 'file type' })
    fotoPembina: string;
    @ApiProperty({ example: '2024-07-03T04:48:57.000Z' })
    publishedAt: string;

    constructor(data: any) {
        const validatedData = CreateStrukturPengurusPembinaSchema.parse(data);
        this.namaPembina = validatedData.namaPembina;
        this.jabatanPembina = validatedData.jabatanPembina;
        this.fotoPembina = validatedData.fotoPembina;
        this.publishedAt = validatedData.publishedAt;
    }
}