'use client';

import type { UseFormReturn } from 'react-hook-form';
import type { CreateStoreSchema } from '@/libs/validations/store';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/libs/utils';

type CreateStoreFormProps = {
  children: React.ReactNode;
  form: UseFormReturn<CreateStoreSchema>;
  onSubmit: (data: CreateStoreSchema) => void;
} & Omit<React.ComponentPropsWithRef<'form'>, 'onSubmit'>;

export function CreateStoreForm({
  children,
  form,
  onSubmit,
  className,
  ...props
}: CreateStoreFormProps) {
  return (
    <Form {...form}>
      <form
        className={cn('grid w-full gap-4', className)}
        onSubmit={form.handleSubmit(onSubmit)}
        autoComplete="off"
        {...props}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Type store name here."
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type store description here."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {children}
      </form>
    </Form>
  );
}
