'use client';

import type { CartItem } from '@/api/schemas/cart/cart.schema';
import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useDeleteCartItem } from '@/api/cart/use-delete-cart-item';
import { useGetCarts } from '@/api/cart/use-get-cart';
import { useUpdateCartQuantity } from '@/api/cart/use-update-cart-quantity';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/libs/utils';
import { CartItemsTable } from './cart-item-table';
import { CartItemsCards } from './cart-items-cards';
import { CartSummary } from './cart-summary';

type CartTableProps = {
  className?: string;
};

export default function CartTable({ className }: CartTableProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'digital' | 'physical'>('physical');
  const { data: digitalData, isLoading: digitalLoading, error: digitalError } = useGetCarts({
    variables:
      {
        cartType: 'DIGITAL',
      },
  },
  );
  const { data: physicalData, isLoading: physicalLoading, error: physicalError } = useGetCarts({
    variables: {
      cartType: 'PHYSICAL',
    },
  });

  const isLoading = digitalLoading || physicalLoading;
  const error = digitalError || physicalError;

  const digitalItems: CartItem[] = digitalData?.data.data ?? [];
  const physicalItems: CartItem[] = physicalData?.data.data ?? [];

  const updateMutation = useUpdateCartQuantity();

  const deleteMutation = useDeleteCartItem();

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    updateMutation.mutate(
      { productVariantId: id, quantity: newQuantity },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['carts'] });
        },
      },
    );
  };

  const handleRemove = (id: string) => {
    deleteMutation.mutate(
      { productVariantId: id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['carts'] });
        },
      },
    );
  };

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error loading carts:
        {error.message}
      </div>
    );
  }

  return (
    <div className={cn(className)}>
      <Tabs
        value={activeTab}
        onValueChange={value => setActiveTab(value as 'digital' | 'physical')}
        className="relative mr-auto w-full p-4"
      >
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="physical">Physical</TabsTrigger>
          <TabsTrigger value="digital">Digital</TabsTrigger>
        </TabsList>
        <TabsContent value="physical">
          <div className="hidden md:block">
            <CartItemsTable
              items={physicalItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemove}
              isDigital={false}
            />
          </div>
          <div className="block md:hidden">
            <CartItemsCards
              items={physicalItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemove}
              isDigital={false}
            />
          </div>
        </TabsContent>
        <TabsContent value="digital">
          <div className="hidden md:block">
            <CartItemsTable
              items={digitalItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemove}
              isDigital={true}
            />
          </div>
          <div className="block md:hidden">
            <CartItemsCards
              items={digitalItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemove}
              isDigital={true}
            />
          </div>
        </TabsContent>
      </Tabs>
      <CartSummary activeTab={activeTab} digitalItems={digitalItems} physicalItems={physicalItems} />
    </div>
  );
}
