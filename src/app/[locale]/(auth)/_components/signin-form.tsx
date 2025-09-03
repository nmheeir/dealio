'use client';

import type { LoginCredentials } from '@/api/auth/type';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/api/auth/auth-context';
import { LoginCredentialsSchema } from '@/api/auth/type';
import { Icons } from '@/components/icons';
import { PasswordInput } from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function SignInForm() {
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
    setError,
    formState: { isSubmitting },
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
    }, 500); // 0.5s để show animation
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">Log in</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Hiển thị lỗi root */}
              {form.formState.errors.root && (
                <div className="rounded-md border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                  {form.formState.errors.root.message}
                </div>
              )}

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="email"
                      className="text-sm font-medium tracking-wide text-muted-foreground uppercase"
                    >
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="w-full"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="password"
                      className="text-sm font-medium tracking-wide text-muted-foreground uppercase"
                    >
                      Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        id="password"
                        placeholder="Enter your password"
                        className="w-full"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-black py-6 text-base font-medium text-white hover:bg-gray-800"
              >
                {isSubmitting && (
                  <Icons.loaderCircle
                    className="mr-2 size-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                Log in
              </Button>
            </form>
          </Form>

          {/* Forgot password */}
          <div className="text-center">
            <Link href="/" className="text-sm text-foreground hover:underline">
              Forgot your password?
            </Link>
          </div>
        </CardContent>
      </Card>

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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
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
