import { z } from 'zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const UpdateMerchandiseSchema = z.object({
    judulMerchandise: z.string().optional(),
    deskripsiMerchandise: z.string().optional(),
    hargaMerchandise: z.number().optional(),
    stockMerchandise: z.string().optional(),
    linkMerchandise: z.string().optional(),
    fotoMerchandise: z.array(z.string()).optional(),
    publishedAt: z.date().optional(),
});

export class UpdateMerchandiseDto {
    @ApiPropertyOptional({ example: 'Judul Merchandise' })
    judulMerchandise?: string;
    @ApiPropertyOptional({ example: 'Deskripsi Merchandise' })
    deskripsiMerchandise?: string;
    @ApiPropertyOptional({ example: 'Rp 100.000' })
    hargaMerchandise?: number;
    @ApiPropertyOptional({ example: '10' })
    stockMerchandise?: string;
    @ApiPropertyOptional({ example: 'https://link-merchandise.com' })
    linkMerchandise?: string;
    @ApiPropertyOptional({ example: 'file type' })
    fotoMerchandise?: string[];
    @ApiPropertyOptional({ example: '2024-07-03T04:48:57.000Z' })
    publishedAt?: Date;

    constructor(data: any) {
        const validatedData = UpdateMerchandiseSchema.parse(data);
        this.judulMerchandise = validatedData.judulMerchandise;
        this.deskripsiMerchandise = validatedData.deskripsiMerchandise;
        this.hargaMerchandise = validatedData.hargaMerchandise;
        this.stockMerchandise = validatedData.stockMerchandise;
        this.linkMerchandise = validatedData.linkMerchandise;
        this.fotoMerchandise = validatedData.fotoMerchandise;
        this.publishedAt = validatedData.publishedAt;
    }
}