/* eslint-disable no-console */
'use client';

import type { Brand } from '@/api/schemas/brand/brand.schema';
import type { Category } from '@/api/schemas/category/category.schema';
import type { Product } from '@/api/schemas/product/product.schema';
import type { UpdateProduct } from '@/api/schemas/product/update-product.schema';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { isEqual } from 'lodash';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useUpdateProduct } from '@/api/products/use-update';
import { updateProductSchema } from '@/api/schemas/product/update-product.schema';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';

type EditProductDialogProps = {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  product: Product;
  categories: Category[];
  brands: Brand[];
};

export function ProductInfoEdit({
  open,
  onOpenChangeAction,
  product,
  categories,
  brands,
}: EditProductDialogProps) {
  const isMobile = useIsMobile();
  const { mutateAsync: updateProduct } = useUpdateProduct();
  const queryClient = useQueryClient();

  const defaultValues = React.useMemo<UpdateProduct>(() => ({
    name: product.name,
    seo_description: product.seo_description,
    seo_title: product.seo_title,
    category_id: product.category_id ?? '',
    brand_id: product.brand_id ?? '',
    description: product.description ?? '',
  }), [product]);

  const form = useForm<UpdateProduct>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      name: product.name,
      seo_description: product.seo_description,
      seo_title: product.seo_title,
      category_id: product.category_id ?? '',
      brand_id: product.brand_id ?? '',
      description: product.description ?? '',
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      console.log(values, product.id);
      await updateProduct({ id: product.id, data: values });
      toast.success('Update product info success');
      await queryClient.invalidateQueries({ queryKey: ['products', { id: product.id }] });
      onOpenChangeAction(false);
    } catch (error) {
      console.error('Form submission error', error);
      toast.error(error.response.data.message ?? 'Failed to submit the form. Please try again.');
    }
  });

  const values = form.watch();

  const isUnchanged = React.useMemo(() => isEqual(values, defaultValues), [values, defaultValues]);

  const FormUI = (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map(c => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brand_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose brand" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {brands.map(b => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="seo_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seo Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter seo title" {...field} />
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
                <Textarea placeholder="Enter seo description" {...field} />
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
                <Textarea placeholder="Enter description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChangeAction(false)}>
            Cancel
          </Button>
          <Button disabled={isUnchanged} type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );

  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChangeAction}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit product</DialogTitle>
          </DialogHeader>
          {FormUI}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChangeAction}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit product</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">{FormUI}</div>
        <DrawerFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChangeAction(false)}>
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
