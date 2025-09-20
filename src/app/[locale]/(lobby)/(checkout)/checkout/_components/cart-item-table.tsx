'use client';

import type { CartItem } from '@/api/schemas/cart/cart.schema';
import { AlertCard } from '@/components/alert-card';
import { cn } from '@/libs/utils';
import { CartItemRow } from './cart-item-row';

export function CartItemsTable({
  items,
  onUpdateQuantity,
  onRemove,
  isDigital,
  getAvailableStock,
  className,
  isPayment = false,
}: {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemove: (itemId: string) => void;
  isDigital: boolean;
  getAvailableStock?: (item: CartItem) => number;
  className?: string;
  isPayment?: boolean;
}) {
  if (items.length === 0) {
    return (
      <div className={cn('flex w-full items-center justify-center py-10', className)}>
        <AlertCard
          icon="shoppingCart"
          title="Your cart is empty"
          className="border-none"
          description="Continue to shopping"
        />
      </div>
    );
  }

  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <table className="min-w-full table-fixed divide-y divide-border text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-3 text-left">Added items</th>
            <th className="w-24 px-4 py-3 text-left">Size</th>
            <th className="w-24 px-4 py-3 text-left">Color</th>
            <th className="w-28 px-4 py-3 text-right">Price</th>
            <th className="w-40 px-4 py-3 text-center">Quantity</th>
            <th className="w-28 px-4 py-3 text-right">Total</th>
            <th className="w-12 px-4 py-3 text-center"> </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map(item => (
            <CartItemRow
              key={item.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemove}
              isDigital={isDigital}
              getAvailableStock={getAvailableStock}
              isPayment={isPayment}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
