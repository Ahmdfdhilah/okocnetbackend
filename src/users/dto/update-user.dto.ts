import { ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';

export const updateUserDtoSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  resetPasswordToken: z.string().optional(),
  role: z.string().optional(),
});

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'john_doe', description: 'Username for the user' })
  username?: string;

  @ApiPropertyOptional({ example: 'john.doe@example.com', description: 'Email address of the user' })
  email?: string;

  @ApiPropertyOptional({ example: 'password123', description: 'Password for the user' })
  password?: string;

  @ApiPropertyOptional({ example: 'reset-token', description: 'Reset password token (optional)' })
  resetPasswordToken?: string;

  @ApiPropertyOptional({ example: 'admin', description: 'Role of the user' })
  role?: string;

  constructor(data: any) {
    const validatedData = updateUserDtoSchema.parse(data);
    Object.assign(this, validatedData);
  }
}