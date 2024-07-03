import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const AuthPayloadSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export class AuthPayloadDto {
    @ApiProperty({ example: 'user@example.com', description: 'User email address' })
    email: string;

    @ApiProperty({ example: 'password123', description: 'User password' })
    password: string;

    constructor(data: any) {
        const validatedData = AuthPayloadSchema.parse(data);
        Object.assign(this, validatedData);
    }
}