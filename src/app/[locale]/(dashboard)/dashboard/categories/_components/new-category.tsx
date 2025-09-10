/* eslint-disable no-console */
'use client';

import type {
  z,
} from 'zod';

import type { Category } from '@/api/schemas/category/category.schema';

import type { CreateCategory } from '@/api/schemas/category/create-category.schema';

import type { updateCategorySchema } from '@/api/schemas/category/update-category.schema';
import {
  zodResolver,
} from '@hookform/resolvers/zod';
import { ScrollArea } from '@radix-ui/react-scroll-area';

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
import { useCreateCategory } from '@/api/category/use-create';
import { createCategorySchema } from '@/api/schemas/category/create-category.schema';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import {
  Form,
  FormControl,
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
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/libs/utils';
import { flattenCategories } from './category-table';

export function NewCategoryButton() {
  const [open, setOpen] = React.useState(false);

  const { data } = useCategories();

  const categories = flattenCategories(data?.data.data ?? []);

  return (
    <div className="px-8">
      <Button
        className="px-4"
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        Create new category
        <Icons.plus />
      </Button>

      <NewCategoryLayout categories={categories} open={open} onOpenChangeAction={setOpen} />
    </div>
  );
}

type NewCategoryFormProps = {
  categories: Category[];
  onOpenChangeAction: (open: boolean) => void;
};

type NewCategoryLayoutProps = {
  categories: Category[];
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
};

function NewCategoryLayout({ categories, open, onOpenChangeAction }: NewCategoryLayoutProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChangeAction}>
        <DrawerContent className={cn(
          'sm:max-w-lg',
          'flex h-[80vh] flex-col',
        )}
        >
          <DrawerHeader>
            <DrawerTitle>Create new Category</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 px-6">
            <NewCategoryForm categories={categories} onOpenChangeAction={onOpenChangeAction} />
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new Category</DialogTitle>
        </DialogHeader>
        <NewCategoryForm categories={categories} onOpenChangeAction={onOpenChangeAction} />
      </DialogContent>
    </Dialog>
  );
}

function NewCategoryForm({ categories, onOpenChangeAction }: NewCategoryFormProps) {
  const { mutateAsync: createCategory } = useCreateCategory();
  const queryClient = useQueryClient();

  const form = useForm <CreateCategory> ({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: '',
      description: '',
      seo_description: '',
      seo_title: '',
    },
  });

  const defaultValues = React.useMemo<CreateCategory>(() => ({
    name: '',
    description: '',
    seo_description: '',
    seo_title: '',
  }), []);

  const values = form.watch();

  const isUnchanged = useMemo(() => isEqual(values, defaultValues), [values, defaultValues]);

  async function onSubmit(values: z.infer <typeof updateCategorySchema>) {
    try {
      console.log(values);
      await createCategory(values);
      toast.success('Create new category success');
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
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
              <FormLabel>Category name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Category name"
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
              <FormLabel>Category Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Category description"
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
          name="seo_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seo Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Category Seo Title"
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
                  placeholder="Category Seo Description"
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChangeAction(false)}>Cancel</Button>
          <Button type="submit" disabled={isUnchanged}>
            Create
          </Button>
        </div>
      </form>
    </Form>
  );
}
