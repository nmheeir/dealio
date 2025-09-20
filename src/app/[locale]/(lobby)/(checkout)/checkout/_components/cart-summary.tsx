'use client';

import type { CartItem } from '@/api/schemas/cart/cart.schema';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/libs/utils';

export function CartSummary({
  activeTab,
  digitalItems,
  physicalItems,
  isPayment = false,
}: {
  activeTab: 'digital' | 'physical';
  digitalItems: CartItem[];
  physicalItems: CartItem[];
  isPayment?: boolean;
}) {
  const router = useRouter();
  const isDigital = activeTab === 'digital';
  const items = isDigital ? digitalItems : physicalItems;
  const count = useMemo(
    () => items.reduce((acc, it) => acc + it.quantity, 0),
    [items],
  );
  const total = useMemo(
    () => items.reduce((acc, it) => acc + Number(it.price) * it.quantity, 0),
    [items],
  );

  if (count === 0) {
    return (
      null
    );
  }

  return (
    <div className="mx-6 my-6 flex justify-end">
      <div className="w-full max-w-md space-y-3">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Items</span>
          <span>{count}</span>
        </div>
        {
          isDigital
            ? (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Taxes</span>
                  <span>Calculated at checkout</span>
                </div>
              )
            : (
                <>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Taxes</span>
                    <span>Calculated at checkout</span>
                  </div>
                </>
              )
        }
        <Separator />
        <div className="flex justify-between text-base font-semibold">
          <span>
            {isDigital ? 'Digital' : 'Physical'}
            {' '}
            Total
          </span>
          <span>{formatPrice(total)}</span>
        </div>
        {!isPayment
          && (
            <Button
              onClick={() => {
                router.push(`/checkout/payment?type=${activeTab}`);
              }}
            >
              Continue to checkout
            </Button>
          )}
      </div>
    </div>
  );
}
