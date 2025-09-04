'use client';

import type { SignUpCredentials } from '@/api/auth/type';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { SignUpCredentialsSchema } from '@/api/auth/type';
import { useSignup } from '@/api/auth/use-signup';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/libs/utils';
import { SocialSignin } from './social-signin';

export default function SignUpForm({ className, ...props }: React.ComponentProps<'form'>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const form = useForm<SignUpCredentials>({
    resolver: zodResolver(SignUpCredentialsSchema),
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

  const signupMutation = useSignup();

  const onSubmit = async (data: SignUpCredentials) => {
    try {
      const result = await signupMutation.mutateAsync(data);

      if (result.statusCode !== 201) {
        setError('root', {
          type: 'manual',
          message: result.message || 'Signup failed',
        });
        return;
      }

      setIsRedirecting(true);
      const redirectTo = searchParams.get('from') || '/signin';
      setTimeout(() => {
        router.replace(redirectTo);
      }, 500);
    } catch (err: any) {
      setError('root', {
        type: 'manual',
        message: err?.message || 'Signup failed',
      });
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn('flex flex-col gap-6 w-full max-w-md', className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to sign up
          </p>
        </div>

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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
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
            Sign Up
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

        {/* Hiển thị lỗi root */}
        {errors.root && (
          <div className="rounded-md border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            {errors.root.message}
          </div>
        )}

        <div className="text-center text-sm">
          Already have an account?
          {' '}
          <Link href="/signin" className="underline underline-offset-4">
            Sign in
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
