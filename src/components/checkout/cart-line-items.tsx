'use client';

import type { CartItem } from '@/api/schemas/cart/cart.schema';
import { Slot } from '@radix-ui/react-slot';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { useDeleteCartItem } from '@/api/cart/use-delete-cart-item';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/libs/utils'; // Hàm cn từ shadcn/ui để merge className
import { Icons } from '../icons';

type CartLineItemsProps = {
  items: CartItem[];
  isScrollable?: boolean;
  isEditable?: boolean;
  variant?: 'default' | 'minimal';
} & React.HTMLAttributes<HTMLDivElement>;

export function CartLineItems({
  items,
  isScrollable = false,
  className,
  ...props
}: CartLineItemsProps) {
  const Comp = (isScrollable ? ScrollArea : Slot) as React.ElementType;
  const { mutateAsync: deleteCartItem } = useDeleteCartItem();
  const queryClient = useQueryClient();

  async function handleDelete(id: string, variant_name: string) {
    await deleteCartItem(
      { productVariantId: id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['carts'] });
          toast.success(`Delete ${variant_name}`);
        },
        onError: (error) => {
          const message
            = (error.response?.data as any)?.message || 'Cannot delete this item';
          toast.error(message);
          console.error('API error:', error);
        },
      },
    );
  }

  return (
    <Comp className={cn('h-full', isScrollable && 'max-h-[500px]', className)} {...props}>
      {items.length === 0
        ? (
            <div className="flex h-full w-full items-center justify-center py-10">
              <p className="text-sm text-gray-500">
                Your cart is empty.
              </p>
            </div>
          )
        : (
            <div className="flex w-full flex-col space-y-4">
              {items.map(item => (
                <CartItemUi
                  key={item.id}
                  item={item}
                  onDeleteAction={(id) => {
                    handleDelete(id, item.name);
                  }}
                />
              ))}
            </div>
          )}
    </Comp>
  );
}

type CartItemUiProps = {
  item: CartItem;
  onDeleteAction: (id: string) => void;
};

export function CartItemUi({ item, onDeleteAction }: CartItemUiProps) {
  const [quantity, setQuantity] = useState(item.quantity);

  const maxStock = item.quantity;

  const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  const handleIncrease = () => setQuantity(prev => (prev < maxStock ? prev + 1 : maxStock));

  const formatPrice = (price: string) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(price));

  return (
    <Card className="mx-4 grid grid-cols-[auto_1fr_auto] items-start gap-4 p-4">
      {/* Cột 1: Ảnh */}
      <div className="relative h-24 w-24 overflow-hidden rounded-md">
        <Image
          src={item.imageUrl}
          alt={item.name}
          className="h-full w-full object-cover"
          width={96}
          height={96}
        />
      </div>

      {/* Cột 2: Tên + trạng thái + giá */}
      <div className="flex flex-col gap-2">
        <CardTitle className="text-lg">{item.name}</CardTitle>
        <Badge variant={item.productStatus === 'ACTIVE' ? 'default' : 'secondary'}>
          {item.productStatus}
        </Badge>
        <div className="text-sm text-muted-foreground">
          Price:
          {' '}
          {formatPrice(item.price)}
        </div>
      </div>

      {/* Cột 3: Delete + Quantity */}
      <div className="flex h-full flex-col items-end justify-between">
        {/* Nút xoá (trên cùng) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDeleteAction(item.product_variant_id)}
          aria-label="Xoá sản phẩm"
        >
          <Icons.trash className="h-5 w-5 text-red-500" />
        </Button>

        {/* Quantity selector (dưới cùng) */}
        { item.cartType === 'PHYSICAL'
          && (
            <div className="flex items-center justify-between rounded-lg border bg-background">
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={handleDecrease}
                disabled={quantity <= 1}
                aria-label="Giảm số lượng"
              >
                <Icons.minus className="h-4 w-4" />
              </Button>
              <div className="flex h-5 w-10 items-center justify-center border-x">
                <input
                  type="number"
                  min={1}
                  max={maxStock}
                  value={quantity}
                  onChange={(e) => {
                    let val = Number(e.target.value);
                    if (Number.isNaN(val) || val < 1) {
                      val = 1;
                    }
                    if (val > maxStock) {
                      val = maxStock;
                    }
                    setQuantity(val);
                  }}
                  className="w-full [appearance:textfield] text-center text-sm font-medium
                   focus:outline-none
                   [&::-webkit-inner-spin-button]:appearance-none
                   [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded-r-none"
                onClick={handleIncrease}
                disabled={quantity >= maxStock}
                aria-label="Tăng số lượng"
              >
                <Icons.plus className="h-4 w-4" />
              </Button>
            </div>
          )}
      </div>
    </Card>

  );
}
