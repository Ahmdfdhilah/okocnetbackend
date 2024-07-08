import { z } from 'zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const UpdateMasterMentorSchema = z.object({
    urlMasterMentor: z.string().optional(),
    publishedAt: z.date().optional(),
});

export class UpdateMasterMentorDto {
    @ApiPropertyOptional({ example: 'https://example.com/master-mentor' })
    urlMasterMentor?: string;
    @ApiPropertyOptional({ example: '2024-07-03T04:48:57.000Z' })
    publishedAt?: Date;

    constructor(data: any) {
        const validatedData = UpdateMasterMentorSchema.parse(data);
        this.urlMasterMentor = validatedData.urlMasterMentor;
        this.publishedAt = validatedData.publishedAt;
    }
}
