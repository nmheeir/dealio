'use client';

import type z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircleIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { PasswordInput } from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { logger } from '@/libs/Logger';
import { resetPasswordSchema } from '@/libs/validations/auth';

type Inputs = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordConfirmForm() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<Inputs>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
      code: '',
    },
  });

  // TODO: change code
  async function onSubmit(data: Inputs) {
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    if (data.code === '123456') {
      router.push(`${window.location.origin}`);
      toast.message('Password reset successfully');
    } else {
      logger.warn('Wrong code !');
    }
  }

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="*********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="*********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the 6-digit code sent to your email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => router.back()}
          >
            Go back
          </Button>
          <Button className="w-full" disabled={loading}>
            {loading && (
              <LoaderCircleIcon
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Reset password
            <span className="sr-only">Reset password</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
