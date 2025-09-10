/* eslint-disable no-console */
'use client';

import type {
  z,
} from 'zod';
import type { Brand } from '@/api/schemas/brand/brand.schema';
import type { UpdateBrand } from '@/api/schemas/brand/update-brand.schema';

import {
  zodResolver,
} from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { isEqual } from 'lodash';
import React, { useMemo } from 'react';
import {
  useForm,
} from 'react-hook-form';
import {
  toast,
} from 'sonner';
import { useUpdateBrand } from '@/api/brand/use-update';
import { updateBrandSchema } from '@/api/schemas/brand/update-brand.schema';
import {
  Button,
} from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Input,
} from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type EditBrandFormProps = {
  item: Brand;
  onOpenChangeAction: (open: boolean) => void;
};

export function EditBrandForm({ item, onOpenChangeAction }: EditBrandFormProps) {
  const { mutateAsync: updateBrand } = useUpdateBrand();
  const queryClient = useQueryClient();

  const defaultValues = useMemo<UpdateBrand>(() => ({
    name: item.name,
    description: item.description,
    seo_description: item.seo_description,
    seo_title: item.seo_title,
  }), [item]);

  const form = useForm <UpdateBrand> ({
    resolver: zodResolver(updateBrandSchema),
    defaultValues: {
      name: item.name,
      description: item.description,
      seo_description: item.seo_description,
      seo_title: item.seo_title,
    },
  });

  const values = form.watch();

  const isUnchanged = useMemo(() => isEqual(values, defaultValues), [values, defaultValues]);

  async function onSubmit(values: z.infer <typeof updateBrandSchema>) {
    try {
      console.log(values);
      await updateBrand({ id: item.id, data: values });
      toast.success('Update brand info success');
      await queryClient.invalidateQueries({ queryKey: ['brands'] });
      onOpenChangeAction(false);
    } catch (error) {
      console.error('Form submission error', error);
      toast.error('Failed to submit the form. Please try again.');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-3xl space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Brand name"
                  type=""
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
              <FormLabel>Brand Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brand description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="seo_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seo Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Brand Seo Title"
                  type=""
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="seo_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seo Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brand Seo Description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChangeAction(false)}>Hủy</Button>
          <Button type="submit" disabled={isUnchanged}>
            Cập nhật
          </Button>
        </div>
      </form>
    </Form>
  );
}
