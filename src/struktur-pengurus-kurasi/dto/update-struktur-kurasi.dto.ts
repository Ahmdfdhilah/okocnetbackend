import { z } from 'zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const UpdateStrukturPengurusKurasiSchema = z.object({
    namaDewan: z.string().optional(),
    jabatanDewan: z.string().optional(),
    fotoDewan: z.string().optional(),
    publishedAt: z.string().optional(),
});

export class UpdateStrukturPengurusKurasiDto {
    @ApiPropertyOptional({ example: 'Ami' })
    namaDewan?: string;
    @ApiPropertyOptional({ example: 'Dir' })
    jabatanDewan?: string;
    @ApiPropertyOptional({ example: 'file type' })
    fotoDewan?: string;
    @ApiPropertyOptional({ example: '2024-07-03T04:48:57.000Z' })
    publishedAt?: string;

    constructor(data: any) {
        const validatedData = UpdateStrukturPengurusKurasiSchema.parse(data);
        this.namaDewan = validatedData.namaDewan;
        this.jabatanDewan = validatedData.jabatanDewan;
        this.fotoDewan = validatedData.fotoDewan;
        this.publishedAt = validatedData.publishedAt;
    }
}
