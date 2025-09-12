'use client';

import type { StockUpdate } from '@/api/schemas/stock/stock-update.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { stockUpdateSchema } from '@/api/schemas/stock/stock-update.schema';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type UpdateStockFormProps = {
  currentStock: number;
  onSubmitAction: (data: StockUpdate) => void;
};

export function UpdateStockForm({ currentStock, onSubmitAction }: UpdateStockFormProps) {
  const form = useForm<StockUpdate>({
    resolver: zodResolver(stockUpdateSchema),
    defaultValues: {
      adjustmentQuantity: 0,
      adjustmentType: 'increase',
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitAction)}
        className="space-y-6 p-4 sm:p-6"
      >
        <div className="text-sm text-muted-foreground">
          Số lượng hiện tại:
          {' '}
          <span className="font-medium">{currentStock}</span>
        </div>

        <FormField
          control={form.control}
          name="adjustmentQuantity"
          render={({ field }) => (
            <FormItem>
              <Label>Số lượng điều chỉnh</Label>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Nhập số lượng"
                  {...field}
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="adjustmentType"
          render={({ field }) => (
            <FormItem>
              <Label>Loại điều chỉnh</Label>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại điều chỉnh" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="increase">Nhập thêm</SelectItem>
                  <SelectItem value="decrease">Giảm bớt</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full sm:w-auto"
        >
          Lưu
        </Button>
      </form>
    </Form>
  );
}
