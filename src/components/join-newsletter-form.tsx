'use client';

import type { EmailSchema } from '@/libs/validations/notification';
import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
import { unknownError } from '@/libs/constants';
import { logger } from '@/libs/Logger';
import { emailSchema } from '@/libs/validations/notification';

export function JoinNewsletterForm() {
  const [loading, setLoading] = React.useState(false);

  // react-hook-form
  const form = useForm<EmailSchema>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: EmailSchema) {
    setLoading(true);
    try {
      const response = await fetch('/api/email/newsletter', {
        method: 'POST',
        body: JSON.stringify({
          email: data.email,
          token: crypto.randomUUID(),
          subject: 'Welcome to Skateshop13',
        }),
      });

      if (!response.ok) {
        switch (response.status) {
          case 409:
            toast.error('You are already subscribed to our newsletter.');
            break;
          case 422:
            toast.error('Invalid input.');
            break;
          case 429:
            toast.error('The daily email limit has been reached.');
            break;
          default:
            toast.error(unknownError);
        }
        return;
      }

      toast.success('You have been subscribed to our newsletter.');
      form.reset();
    } catch (err) {
      logger.info(err as string);
      toast.error(unknownError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        className="grid w-full"
        onSubmit={form.handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="relative space-y-0">
              <FormLabel className="sr-only">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="skate@gmail.com"
                  className="pr-12"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <Button
                className="absolute top-[4px] right-[3.5px] z-20 size-7"
                size="icon"
                disabled={loading}
              >
                {loading
                  ? (
                      <Icons.loaderCircle
                        className="size-3 animate-spin"
                        aria-hidden="true"
                      />
                    )
                  : (
                      <Icons.sendHorizontal className="size-3" aria-hidden="true" />
                    )}
                <span className="sr-only">Join newsletter</span>
              </Button>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
