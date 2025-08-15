'use client';

import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircleIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { logger } from '@/libs/Logger';
import { checkEmailSchema } from '@/libs/validations/auth';

type Inputs = z.infer<typeof checkEmailSchema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<Inputs>({
    resolver: zodResolver(checkEmailSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: Inputs) {
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      logger.info(data.email);
      const canNavigateToConfirm = true;
      if (canNavigateToConfirm) {
        router.push('/signin/reset-password/confirm');
        toast.message('Check your email', {
          description: 'We sent you a 6-digit verification code.',
        });
      }
    } catch (err) {
      logger.warn(err as string);
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
