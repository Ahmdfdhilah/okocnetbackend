import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const CreateStrukturPengurusKurasiSchema = z.object({
    namaDewan: z.string(),
    jabatanDewan: z.string(),
    fotoDewan: z.string(),
    publishedAt: z.string(),
});

export class CreateStrukturPengurusKurasiDto {
    @ApiProperty({ example: 'Ami' })
    namaDewan: string;
    @ApiProperty({ example: 'Dir' })
    jabatanDewan: string;
    @ApiProperty({ example: 'file type' })
    fotoDewan: string;
    @ApiProperty({ example: '2024-07-03T04:48:57.000Z' })
    publishedAt: string;

    constructor(data: any) {
        const validatedData = CreateStrukturPengurusKurasiSchema.parse(data);
        this.namaDewan = validatedData.namaDewan;
        this.jabatanDewan = validatedData.jabatanDewan;
        this.fotoDewan = validatedData.fotoDewan;
        this.publishedAt = validatedData.publishedAt;
    }
}