import { ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';

export const UpdateStrukturPengurusPembinaSchema = z.object({
    namaPembina: z.string().optional(),
    jabatanPembina: z.string().optional(),
    fotoPembina: z.string().optional(),
    publishedAt: z.string().optional(),
});

export class UpdateStrukturPengurusPembinaDto {
    @ApiPropertyOptional({ example: 'Ami' })
    namaPembina: string;
    @ApiPropertyOptional({ example: 'Dir' })
    jabatanPembina: string;
    @ApiPropertyOptional({ example: 'file type' })
    fotoPembina: string;
    @ApiPropertyOptional({ example: '2024-07-03T04:48:57.000Z' })
    publishedAt: string;

    constructor(data: any) {
        const validatedData = UpdateStrukturPengurusPembinaSchema.parse(data);
        this.namaPembina = validatedData.namaPembina;
        this.jabatanPembina = validatedData.jabatanPembina;
        this.fotoPembina = validatedData.fotoPembina;
        this.publishedAt = validatedData.publishedAt;
    }
}