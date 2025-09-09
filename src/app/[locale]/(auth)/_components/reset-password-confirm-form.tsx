'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircleIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { useVerifyResetPassword } from '@/api/auth/use-verify-reset-password';
import { PasswordInput } from '@/components/password-input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { logger } from '@/libs/Logger';

const resetPasswordConfirmSchema = z.object({
  newPassword: z
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .regex(/\d/, 'Mật khẩu phải chứa số')
    .regex(/[a-z]/i, 'Mật khẩu phải chứa chữ'),
});

type Inputs = z.infer<typeof resetPasswordConfirmSchema>;

export default function ResetPasswordConfirmForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const code = searchParams.get('code') ?? '';
  const { mutateAsync } = useVerifyResetPassword();

  const form = useForm<Inputs>({
    resolver: zodResolver(resetPasswordConfirmSchema),
    defaultValues: {
      newPassword: '',
    },
  });

  async function onSubmit(data: Inputs) {
    try {
      logger.info('📦 Payload gửi đi:', { email, code, ...data });

      const response = await mutateAsync({
        email,
        code,
        newPassword: data.newPassword,
      });

      logger.info('✅ Reset thành công:', response);
      toast.success('Đặt lại mật khẩu thành công, vui lòng đăng nhập lại');

      router.push('/signin');
    } catch (err: any) {
      logger.error('❌ Reset thất bại:', err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
    }
  }

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Mật khẩu mới */}
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu mới</FormLabel>
              <FormControl>
                <PasswordInput placeholder="*********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row">
          <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <LoaderCircleIcon
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Xác nhận
          </Button>
        </div>
      </form>
    </Form>
  );
}
