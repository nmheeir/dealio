'use client';

import type { LoginCredentials } from '@/api/auth/type';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useAuth } from '@/api/auth/auth-context';
import { LoginCredentialsSchema } from '@/api/auth/type';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/libs/utils';
import { SocialSignin } from './social-signin';

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [isRedirecting, setIsRedirecting] = React.useState(false);

  const form = useForm<LoginCredentials>({
    resolver: zodResolver(LoginCredentialsSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginCredentials) {
    const result = await login(data);

    if (result.statusCode !== 200) {
      toast.error(result.message || 'Đăng nhập thất bại');

      return;
    }

    setIsRedirecting(true);
    const redirectTo = searchParams.get('from') || '/';
    setTimeout(() => {
      router.replace(redirectTo);
    }, 500);
  }

  return (
    <div className="relative flex items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn('flex flex-col gap-6 w-full max-w-md', className)}
          {...props}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Login to your account</h1>
            <p className="text-sm text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>

          <div className="grid gap-6">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="m@example.com"
                      autoComplete="email"
                      disabled={form.formState.isSubmitting}
                      className={form.formState.errors.root ? 'border-red-500' : ''}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href="/signin/reset-password"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="current-password"
                      disabled={form.formState.isSubmitting}
                      className={form.formState.errors.password ? 'border-red-500' : ''}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && (
                <Icons.loaderCircle
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Login
            </Button>

            {/* OAuth divider */}
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>

            {/* OAuth button */}
            <SocialSignin />
          </div>

          <div className="text-center text-sm">
            Don&apos;t have an account?
            {' '}
            <Link href="/signup" className="underline underline-offset-4">
              Sign up
            </Link>
          </div>
        </form>
      </Form>

      {/* Overlay khi redirect */}
      {isRedirecting && (
        <div className="absolute inset-0 flex items-center justify-center bg-white transition-opacity duration-500">
          <div className="flex flex-col items-center space-y-4">
            <svg
              className="h-10 w-10 animate-spin text-indigo-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0
                   0 5.373 0 12h4z"
              />
            </svg>
            <p className="text-gray-600">Đang chuyển hướng...</p>
          </div>
        </div>
      )}
    </div>
  );
}
