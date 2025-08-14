import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircleIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { PasswordInput } from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { showErrorToast } from '@/libs/handle-error';
import { authSchema } from '@/libs/validations/auth';

type Inputs = z.infer<typeof authSchema>;

export function SignInForm() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<Inputs>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: Inputs) {
    setLoading(true);

    try {
      // Delay 500ms để giả lập network request
      await new Promise(resolve => setTimeout(resolve, 500));

      // Kiểm tra email và password thủ công
      if (data.email === 'test@gmail.test' && data.password === 'abc123') {
      // Giả lập setActive session (nếu cần)
      // Ví dụ lưu thông tin user vào localStorage hoặc context
        localStorage.setItem('session', 'mock-session-id');

        // Chuyển hướng về trang chính
        router.push(`${window.location.origin}/`);
      } else {
      // Nếu login không hợp lệ
        showErrorToast('Invalid email or password');
      }
    } catch (err) {
      showErrorToast(err);
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
                <Input
                  type="text"
                  placeholder="rodneymullen180@gmail.com"
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="**********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-2" disabled={loading}>
          {loading && (
            <LoaderCircleIcon
              className="mr-2 size-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Sign in
          <span className="sr-only">Sign in</span>
        </Button>
      </form>
    </Form>
  );
}
