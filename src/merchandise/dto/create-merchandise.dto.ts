import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const CreateMerchandiseSchema = z.object({
    judulMerchandise: z.string(),
    deskripsiMerchandise: z.string().optional(),
    hargaMerchandise: z.string(),
    stockMerchandise: z.string(),
    linkMerchandise: z.string(),
    fotoMerchandise: z.array(z.string()),
    publishedAt: z.string(),
});

export class CreateMerchandiseDto {
    @ApiProperty({ example: 'Judul Merchandise' })
    judulMerchandise: string;
    @ApiProperty({ example: 'Deskripsi Merchandise' })
    deskripsiMerchandise?: string;
    @ApiProperty({ example: 'Rp 100.000' })
    hargaMerchandise: string;
    @ApiProperty({ example: '10' })
    stockMerchandise: string;
    @ApiProperty({ example: 'https://link-merchandise.com' })
    linkMerchandise: string;
    @ApiProperty({ example: 'file type' })
    fotoMerchandise: string[];
    @ApiProperty({ example: '2024-07-03T04:48:57.000Z' })
    publishedAt: string;

    constructor(data: any) {
        const validatedData = CreateMerchandiseSchema.parse(data);
        this.judulMerchandise = validatedData.judulMerchandise;
        this.deskripsiMerchandise = validatedData.deskripsiMerchandise;
        this.hargaMerchandise = validatedData.hargaMerchandise;
        this.stockMerchandise = validatedData.stockMerchandise;
        this.linkMerchandise = validatedData.linkMerchandise;
        this.fotoMerchandise = validatedData.fotoMerchandise;
        this.publishedAt = validatedData.publishedAt;
    }
}