import { z } from 'zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const UpdateStrukturPengurusHarianSchema = z.object({
    namaPengurus: z.string().optional(),
    jabatanPengurus: z.string().optional(),
    fotoPengurus: z.string().optional(),
    publishedAt: z.string().optional(),
});

export class UpdateStrukturPengurusHarianDto {
    @ApiPropertyOptional({ example: 'John Doe' })
    namaPengurus?: string;
    
    @ApiPropertyOptional({ example: 'Ketua' })
    jabatanPengurus?: string;
    
    @ApiPropertyOptional({ example: 'file type' })
    fotoPengurus?: string;
    
    @ApiPropertyOptional({ example: '2024-07-03T04:48:57.000Z' })
    publishedAt?: string;

    constructor(data: any) {
        const validatedData = UpdateStrukturPengurusHarianSchema.parse(data);
        this.namaPengurus = validatedData.namaPengurus;
        this.jabatanPengurus = validatedData.jabatanPengurus;
        this.fotoPengurus = validatedData.fotoPengurus;
        this.publishedAt = validatedData.publishedAt;
    }
}
