/* eslint-disable no-console */
'use client';

import type { CreateProduct } from '@/api/schemas/product/create-product.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import * as React from 'react';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useCreateProduct } from '@/api/products/use-create-product';
import { createProductSchema } from '@/api/schemas/product/create-product.schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { cn } from '@/libs/utils';

type NewProductFormProps = {
  categories: { id: string; name: string }[];
  brands: { id: string; name: string }[];
};

export function NewProductForm({ categories, brands }: NewProductFormProps) {
  const isMobile = useIsMobile();
  const [mainType, setMainType] = React.useState<'PHYSICAL' | 'DIGITAL' | ''>('');

  const queryClient = useQueryClient();
  const { mutateAsync: createProduct } = useCreateProduct();

  const form = useForm<CreateProduct>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: '',
      description: '',
      product_type: 'DEVICE',
      category_id: '',
      brand_id: '',
      seo_title: '',
      seo_description: '',
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    console.log('Form submit:', values);
    try {
      await createProduct(values);
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Thêm sản phẩm thành công');
      form.reset();
    } catch (error) {
      console.error('Form submission error', error);
      toast.error(error.response.data.message ?? 'Failed to submit the form. Please try again.');
    }
  });

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card className={cn(
        isMobile && 'border-none shadow-none',
      )}
      >
        <CardHeader>
          <CardTitle>Thêm sản phẩm mới</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Chọn loại chính: PHYSICAL / DIGITAL */}
              <div className="space-y-2">
                <FormLabel>Bạn muốn thêm sản phẩm loại nào?</FormLabel>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={mainType === 'PHYSICAL' ? 'default' : 'outline'}
                    onClick={() => {
                      setMainType('PHYSICAL');
                      form.setValue('product_type', 'DEVICE');
                    }}
                  >
                    PHYSICAL
                  </Button>
                  <Button
                    type="button"
                    variant={mainType === 'DIGITAL' ? 'default' : 'outline'}
                    onClick={() => {
                      setMainType('DIGITAL');
                      form.setValue('product_type', 'CARD_DIGITAL_KEY');
                    }}
                  >
                    DIGITAL
                  </Button>
                </div>
              </div>

              {/* Chọn subtype */}
              {mainType === 'PHYSICAL' && (
                <FormField
                  control={form.control}
                  name="product_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại sản phẩm</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại sản phẩm" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="DEVICE">DEVICE</SelectItem>
                          <SelectItem value="CARD_PHYSICAL">CARD_PHYSICAL</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {mainType === 'DIGITAL' && (
                <FormField
                  control={form.control}
                  name="product_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại sản phẩm</FormLabel>
                      <Select value="CARD_DIGITAL_KEY" disabled>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CARD_DIGITAL_KEY">CARD_DIGITAL_KEY</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              )}

              {/* Tên sản phẩm */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên sản phẩm</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên sản phẩm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Danh mục & Thương hiệu */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh mục</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn danh mục" />
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
                      <FormLabel>Thương hiệu</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn thương hiệu" />
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

              {/* Mô tả */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả sản phẩm</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Nhập mô tả sản phẩm" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Mô tả */}
              <FormField
                control={form.control}
                name="seo_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seo title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter SEO title" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Mô tả */}
              <FormField
                control={form.control}
                name="seo_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seo description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter seo description" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button type="submit">Lưu</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
