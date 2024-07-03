import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

export class ForgotPasswordDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  email: string;

  constructor(data: any) {
    const validatedData = ForgotPasswordSchema.parse(data);
    Object.assign(this, validatedData);
  }
}
