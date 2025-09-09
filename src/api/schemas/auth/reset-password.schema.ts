import z from 'zod';

export const resetPasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Mật khẩu cũ bắt buộc'),
    newPassword: z
      .string()
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .regex(/[A-Z]/i, 'Mật khẩu phải chứa chữ')
      .regex(/\d/, 'Mật khẩu phải chứa số'),
    confirmPassword: z.string().min(1, 'Xác nhận mật khẩu bắt buộc'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Mật khẩu nhập lại không khớp',
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
