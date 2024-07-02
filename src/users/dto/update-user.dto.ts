import { z } from 'zod';

export const UpdateUserDto = z.object({
  username: z.string().min(3).max(50).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  resetPasswordToken: z.string().optional(),
  role: z.string().optional(),
});

export type UpdateUserDtoType = z.infer<typeof UpdateUserDto>;