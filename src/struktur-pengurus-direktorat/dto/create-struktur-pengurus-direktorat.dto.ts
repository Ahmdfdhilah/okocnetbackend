import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const CreateStrukturPengurusDirektoratSchema = z.object({
    namaPengurus: z.string(),
    jabatanPengurus: z.string(),
    fotoPengurus: z.string(),
    publishedAt: z.string(),
});

export class CreateStrukturPengurusDirektoratDto {
    @ApiProperty({ example: 'John Doe' })
    namaPengurus: string;
    @ApiProperty({ example: 'Director' })
    jabatanPengurus: string;
    @ApiProperty({ example: 'file type' })
    fotoPengurus: string;
    @ApiProperty({ example: '2024-07-03T04:48:57.000Z' })
    publishedAt: string;

    constructor(data: any) {
        const validatedData = CreateStrukturPengurusDirektoratSchema.parse(data);
        this.namaPengurus = validatedData.namaPengurus;
        this.jabatanPengurus = validatedData.jabatanPengurus;
        this.fotoPengurus = validatedData.fotoPengurus;
        this.publishedAt = validatedData.publishedAt;
    }
}