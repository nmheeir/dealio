/* eslint-disable no-console */
'use client';

import type { Category } from '@/api/schemas/category/category.schema';
import type { UpdateCategory } from '@/api/schemas/category/update-category.schema';
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
import { useCategories } from '@/api/category/use-categories';
import { useUpdateCategory } from '@/api/category/use-update';
import { updateCategorySchema } from '@/api/schemas/category/update-category.schema';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { flattenCategories } from './category-table';

type EditCategoryFormProps = {
  item: Category;
  categories: Category[];
  onOpenChangeAction: (open: boolean) => void;
};

export function EditCategoryForm({ item, onOpenChangeAction }: EditCategoryFormProps) {
  const { mutateAsync: updateCategory } = useUpdateCategory();
  const queryClient = useQueryClient();
  const { data } = useCategories();

  const categories = flattenCategories(data?.data.data ? data.data.data : []);

  const defaultValues = useMemo<UpdateCategory>(() => ({
    name: item.name,
    description: item.description,
    seo_description: item.seo_description,
    seo_title: item.seo_title,
  }), [item]);

  const form = useForm<UpdateCategory>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: item.name,
      description: item.description,
      seo_description: item.seo_description,
      seo_title: item.seo_title,
    },
  });

  const values = form.watch();

  const isUnchanged = useMemo(() => isEqual(values, defaultValues), [values, defaultValues]);

  async function onSubmit(values: UpdateCategory) {
    try {
      console.log(values, item.id);
      await updateCategory({ id: item.id, data: values });
      toast.success('Update brand info success');
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
      onOpenChangeAction(false);
    } catch (error) {
      console.error('Form submission error', error);
      toast.error(error.response.data.message ?? 'Failed to submit the form. Please try again.');
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
              <FormLabel>Category name</FormLabel>
              <FormControl>
                <Input
                  placeholder="category name"
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
              <FormLabel>category Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="category description"
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
                  placeholder="category Seo Title"
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
                  placeholder="category Seo Description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parent_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Choose parent category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={item.id}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>You can manage email addresses in your email settings.</FormDescription>
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
