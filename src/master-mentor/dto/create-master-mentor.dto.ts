import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const CreateMasterMentorSchema = z.object({
    urlMasterMentor: z.string(),
    publishedAt: z.date(),
});

export class CreateMasterMentorDto {
    @ApiProperty({ example: 'https://example.com/master-mentor' })
    urlMasterMentor: string;
    @ApiProperty({ example: '2024-07-03T04:48:57.000Z' })
    publishedAt: Date;

    constructor(data: any) {
        const validatedData = CreateMasterMentorSchema.parse(data);
        this.urlMasterMentor = validatedData.urlMasterMentor;
        this.publishedAt = validatedData.publishedAt;
    }
}
