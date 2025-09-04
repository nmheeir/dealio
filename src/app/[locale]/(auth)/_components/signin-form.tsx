'use client';

import type { LoginCredentials } from '@/api/auth/type';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/api/auth/auth-context';

import { LoginCredentialsSchema } from '@/api/auth/type';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

  const {
    handleSubmit,
    register,
    setError,
    formState: { isSubmitting, errors },
  } = form;

  const onSubmit = async (data: LoginCredentials) => {
    const result = await login(data);

    if (!result.success) {
      setError('root', {
        type: 'manual',
        message: result.error || 'Signin Fail',
      });
      return;
    }

    setIsRedirecting(true);
    const redirectTo = searchParams.get('from') || '/';
    setTimeout(() => {
      router.replace(redirectTo);
    }, 500);
  };

  return (
    <div className="relative flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn('flex flex-col gap-6 w-full max-w-md', className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>

        {/* Hiển thị lỗi root */}
        {errors.root && (
          <div className="rounded-md border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            {errors.root.message}
          </div>
        )}

        <div className="grid gap-6">
          {/* Email */}
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              autoComplete="email"
              {...register('email')}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="grid gap-3">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/signin/reset-password"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password')}
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && (
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

          {/* OAuth button (GitHub hoặc Google) */}
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
              >
              </circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0
                   0 5.373 0 12h4z"
              >
              </path>
            </svg>
            <p className="text-gray-600">Đang chuyển hướng...</p>
          </div>
        </div>
      )}
    </div>
  );
}
