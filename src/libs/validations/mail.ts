import { z } from 'zod';

export const checkEmailSchema = z.object({
  email: z
    .email('Email không hợp lệ')
    .min(1, 'Email không được để trống'),
});

export type CheckEmailSchema = z.infer<typeof checkEmailSchema>;
