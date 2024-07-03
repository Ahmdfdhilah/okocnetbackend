import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const createUserDtoSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  resetPasswordToken: z.string().optional(),
  role: z.string(),
});

export class CreateUserDto {
  @ApiProperty({ example: 'john_doe', description: 'Username for the user' })
  username: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email address of the user' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Password for the user' })
  password: string;

  @ApiProperty({ example: 'reset-token', description: 'Reset password token (optional)' })
  resetPasswordToken?: string;

  @ApiProperty({ example: 'admin', description: 'Role of the user' })
  role: string;

  constructor(data: any) {
    const validatedData = createUserDtoSchema.parse(data);
    Object.assign(this, validatedData);
  }
}
