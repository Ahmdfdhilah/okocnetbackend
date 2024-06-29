import { z } from 'zod';

export const CreateUserDto = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  provider: z.string().optional(),
  resetPasswordToken: z.string().optional(),
  confirmationToken: z.string().optional(),
  role: z.string(),
});

export type CreateUserDtoType = z.infer<typeof CreateUserDto>;