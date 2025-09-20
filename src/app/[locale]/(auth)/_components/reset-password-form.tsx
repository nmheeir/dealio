/* eslint-disable no-console */
'use client';

import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircleIcon } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useForgotPasswordRequest } from '@/api/auth/use-forgot-password-request';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { logger } from '@/libs/Logger';
import { checkEmailSchema } from '@/libs/validations/mail';

type Inputs = z.infer<typeof checkEmailSchema>;

export function ResetPasswordForm() {
  const [loading, setLoading] = React.useState(false);
  const { mutateAsync } = useForgotPasswordRequest();

  const form = useForm<Inputs>({
    resolver: zodResolver(checkEmailSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: Inputs) {
    setLoading(true);

    try {
      console.info('📨 Sending forgot password request:', data.email);

      const response = await mutateAsync(data);

      if (response?.statusCode === 201) {
        toast.success('Đã gửi email xác nhận thành công', {
          description: 'Vui lòng kiểm tra hộp thư để lấy mã xác nhận 6 chữ số.',
        });
        // router.push('/signin/reset-password/confirm');
      } else {
        toast.error('Có lỗi xảy ra, vui lòng thử lại');
      }
    } catch (err: any) {
      logger.error('❌ Forgot password error:', err);

      // Nếu API trả về lỗi có message
      const message
      = err?.response?.data?.message || 'Email không hợp lệ hoặc chưa được đăng ký';

      form.setError('email', {
        type: 'server',
        message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="rodneymullen180@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-2" disabled={loading}>
          {loading && (
            <LoaderCircleIcon
              className="mr-2 size-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Continue
          <span className="sr-only">
            Continue to reset password verification
          </span>
        </Button>
      </form>
    </Form>
  );
}
