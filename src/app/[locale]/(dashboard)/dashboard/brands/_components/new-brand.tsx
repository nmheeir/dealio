/* eslint-disable no-console */
'use client';

import type {
  z,
} from 'zod';

import type { CreateBrand } from '@/api/schemas/brand/create-brand.schema';
import type { updateBrandSchema } from '@/api/schemas/brand/update-brand.schema';
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
import { useCreateBrand } from '@/api/brand/use-create-brand';
import { createBrandSchema } from '@/api/schemas/brand/create-brand.schema';
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
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/libs/utils';

export function NewBrandButton() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="px-8">
      <Button
        className="px-4"
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        Create new brand
        <Icons.plus />
      </Button>

      <NewBrandLayout open={open} onOpenChangeAction={setOpen} />
    </div>
  );
}

type NewBrandFormProps = {
  onOpenChangeAction: (open: boolean) => void;
};

type NewBrandLayoutProps = {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
};

function NewBrandLayout({ open, onOpenChangeAction }: NewBrandLayoutProps) {
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
            <DrawerTitle>Create new brand</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 px-6">
            <NewBrandForm onOpenChangeAction={onOpenChangeAction} />
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new brand</DialogTitle>
        </DialogHeader>
        <NewBrandForm onOpenChangeAction={onOpenChangeAction} />
      </DialogContent>
    </Dialog>
  );
}

function NewBrandForm({ onOpenChangeAction }: NewBrandFormProps) {
  const { mutateAsync: createBrand } = useCreateBrand();
  const queryClient = useQueryClient();

  const form = useForm <CreateBrand> ({
    resolver: zodResolver(createBrandSchema),
    defaultValues: {
      name: '',
      description: '',
      seo_description: '',
      seo_title: '',
    },
  });

  const defaultValues = React.useMemo<CreateBrand>(() => ({
    name: '',
    description: '',
    seo_description: '',
    seo_title: '',
  }), []);

  const values = form.watch();

  const isUnchanged = useMemo(() => isEqual(values, defaultValues), [values, defaultValues]);

  async function onSubmit(values: z.infer <typeof updateBrandSchema>) {
    try {
      console.log(values);
      await createBrand(values);
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
          <Button type="button" variant="outline" onClick={() => onOpenChangeAction(false)}>Cancel</Button>
          <Button type="submit" disabled={isUnchanged}>
            Create
          </Button>
        </div>
      </form>
    </Form>
  );
}
