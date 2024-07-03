import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const ForgotPasswordTokenSchema = z.object({
  token: z.string(),
  newPassword: z.string(),
});

export class ForgotPasswordTokenDto {
  @ApiProperty({ example: 'user token forgot password', description: 'User token generated' })
  token: string;
  @ApiProperty({ example: 'user new password', description: 'user new password' })
  newPassword: string;

  constructor(data: any) {
    const validatedData = ForgotPasswordTokenSchema.parse(data);
    Object.assign(this, validatedData);
  }
}
