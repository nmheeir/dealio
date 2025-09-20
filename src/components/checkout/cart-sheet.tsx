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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn, formatPrice } from '@/libs/utils';
import { Card, CardContent } from '../ui/card';

export function CartSheet() {
  const isMobile = useIsMobile();

  const digital = useGetCarts({ variables: {
    cartType: 'DIGITAL',
  } });
  const physical = useGetCarts({ variables: {
    cartType: 'PHYSICAL',
  } });

  const isLoading = digital.isLoading || physical.isLoading;
  const error = digital.error || physical.error;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="ml-2 h-4 w-20" />
      </div>
    );
  }

  if (error || (!digital.data && !physical.data)) {
    return (
      <div className="flex items-center justify-center p-4 text-red-500">
        {error?.message || 'Failed to load cart'}
      </div>
    );
  }

  const digitalCarts: CartItem[] = digital.data?.data.data ?? [];
  const physicalCarts: CartItem[] = physical.data?.data.data ?? [];

  const itemCount
    = digitalCarts.reduce((total, item) => total + item.quantity, 0)
      + physicalCarts.reduce((total, item) => total + item.quantity, 0);

  const cartTotal
    = digitalCarts.reduce((total, item) => total + Number(item.price) * item.quantity, 0)
      + physicalCarts.reduce((total, item) => total + Number(item.price) * item.quantity, 0);

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
          <Separator className="" />
        </SheetHeader>
        {itemCount > 0
          ? (
              <>
                <Tabs defaultValue="digital" className="flex flex-1 flex-col">
                  <TabsList className="grid w-full grid-cols-2 px-4">
                    <TabsTrigger value="digital">Digital</TabsTrigger>
                    <TabsTrigger value="physical">Physical</TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="digital"
                    className={cn(
                      'flex-1 overflow-auto',
                      !isMobile && 'max-h-[400px]',
                    )}

                  >
                    <CartLineItems
                      items={digitalCarts}
                      isScrollable
                      isEditable
                      variant="default"
                      className="h-full"
                    />
                  </TabsContent>
                  <TabsContent
                    value="physical"
                    className={cn(
                      'flex-1 overflow-auto',
                      !isMobile && 'max-h-[400px]',
                    )}

                  >
                    <CartLineItems
                      items={physicalCarts}
                      isScrollable
                      isEditable
                      variant="default"
                      className="h-full"
                    />
                  </TabsContent>
                </Tabs>
                <div className="">
                  <SheetFooter>
                    <Card className="rounded-xl border-none bg-background shadow-none">
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
                    <SheetTrigger asChild>
                      <Link
                        aria-label="Go to checkout"
                        href="/checkout"
                        className={cn(
                          buttonVariants({
                            size: 'lg',
                            className: 'w-full',
                          }),
                        )}
                      >
                        Go to checkout
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
