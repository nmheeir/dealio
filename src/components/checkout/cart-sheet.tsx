'use client';

import type { CartItem } from '@/api/schemas/cart/cart.schema';
import Link from 'next/link';
import { useGetCarts } from '@/api/cart/use-get-cart';
import { CartLineItems } from '@/components/checkout/cart-line-items';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, formatPrice } from '@/libs/utils';
import { Card, CardContent } from '../ui/card';

export function CartSheet() {
  const { data, isLoading, error } = useGetCarts();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="ml-2 h-4 w-20" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center p-4 text-red-500">
        {error?.message || 'Failed to load cart'}
      </div>
    );
  }

  const carts: CartItem[] = data.data.data;
  const itemCount = carts.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = carts.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          aria-label="Open cart"
          variant="outline"
          size="icon"
          className="relative"
        >
          {itemCount > 0 && (
            <Badge
              variant="secondary"
              className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full"
            >
              {itemCount}
            </Badge>
          )}
          <Icons.shoppingCart className="size-4" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader className="pr-6">
          <SheetTitle>
            Cart
            {' '}
            {itemCount > 0 ? `(${itemCount})` : ''}
          </SheetTitle>
          <Separator className="my-2" />
        </SheetHeader>
        {itemCount > 0
          ? (
              <>
                <CartLineItems
                  items={carts}
                  isScrollable
                  isEditable
                  variant="default"
                  className="flex-1"
                />
                <div className="space-y-4">
                  <Separator />
                  <Card className="rounded-xl border-none bg-background p-4 shadow-none">
                    <CardContent className="space-y-3 text-sm">
                      {/* Shipping */}
                      <div className="flex justify-between text-muted-foreground">
                        <span>Shipping</span>
                        <span>Free</span>
                      </div>

                      {/* Taxes */}
                      <div className="flex justify-between text-muted-foreground">
                        <span>Taxes</span>
                        <span>Calculated at checkout</span>
                      </div>

                      {/* Divider */}
                      <Separator />

                      {/* Total */}
                      <div className="flex justify-between text-base font-semibold">
                        <span>Total</span>
                        <span>{formatPrice(cartTotal.toFixed(2))}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <SheetFooter>
                    <SheetTrigger asChild>
                      <Link
                        aria-label="Continue to checkout"
                        href="/checkout"
                        className={cn(
                          buttonVariants({
                            size: 'lg',
                            className: 'w-full',
                          }),
                        )}
                      >
                        Continue to checkout
                      </Link>
                    </SheetTrigger>
                  </SheetFooter>
                </div>
              </>
            )
          : (
              <div className="flex h-full flex-col items-center justify-center space-y-4">
                <Icons.shoppingCart
                  className="size-16 text-muted-foreground"
                  aria-hidden="true"
                />
                <div className="text-xl font-medium text-muted-foreground">
                  Your cart is empty
                </div>
                <SheetTrigger asChild>
                  <Link
                    aria-label="Add items to your cart to checkout"
                    href="/products"
                    className={cn(
                      buttonVariants({
                        variant: 'link',
                        size: 'sm',
                        className: 'text-sm text-muted-foreground',
                      }),
                    )}
                  >
                    Add items to your cart
                  </Link>
                </SheetTrigger>
              </div>
            )}
      </SheetContent>
    </Sheet>
  );
}
