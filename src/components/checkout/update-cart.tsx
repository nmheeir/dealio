'use client';

import type { CartLineItemSchema } from '@/libs/validations/cart';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '../icons';

type UpdateCartProps = {
  cartLineItem: CartLineItemSchema;
};

export function UpdateCart({ cartLineItem }: UpdateCartProps) {
  const id = React.useId();
  const [isPending, _startTransition] = React.useTransition();

  return (
    <div className="flex w-full items-center justify-between space-x-2">
      <div className="flex items-center">
        <Button
          id={`${id}-decrement`}
          variant="outline"
          size="icon"
          className="size-8 rounded-r-none"
          onClick={() => {
            // startTransition(async () => {
            //   try {
            //     await updateCartItem({
            //       productId: cartLineItem.id,
            //       quantity: Number(cartLineItem.quantity) - 1,
            //     });
            //   } catch (err) {
            //     showErrorToast(err);
            //   }
            // });
          }}
          disabled={isPending}
        >
          <Icons.minus className="size-3" aria-hidden="true" />
          <span className="sr-only">Remove one item</span>
        </Button>
        <Input
          id={`${id}-quantity`}
          type="number"
          min="0"
          className="h-8 w-14 rounded-none border-x-0"
          value={cartLineItem.quantity}
          onChange={() => {
            // startTransition(async () => {
            //   try {
            //     await updateCartItem({
            //       productId: cartLineItem.id,
            //       quantity: Number(e.target.value),
            //     });
            //   } catch (err) {
            //     showErrorToast(err);
            //   }
            // });
          }}
          disabled={isPending}
        />
        <Button
          id={`${id}-increment`}
          variant="outline"
          size="icon"
          className="size-8 rounded-l-none"
          onClick={() => {
            // startTransition(async () => {
            //   try {
            //     await updateCartItem({
            //       productId: cartLineItem.id,
            //       quantity: Number(cartLineItem.quantity) + 1,
            //     });
            //   } catch (err) {
            //     showErrorToast(err);
            //   }
            // });
          }}
          disabled={isPending}
        >
          <Icons.plus className="size-3" aria-hidden="true" />
          <span className="sr-only">Add one item</span>
        </Button>
      </div>
      <Button
        id={`${id}-delete`}
        variant="outline"
        size="icon"
        className="size-8"
        onClick={() => {
          // startTransition(async () => {
          //   try {
          //     await deleteCartItem({
          //       productId: cartLineItem.id,
          //     });
          //   } catch (err) {
          //     showErrorToast(err);
          //   }
          // });
        }}
        disabled={isPending}
      >
        <Icons.trash className="size-3" aria-hidden="true" />
        <span className="sr-only">Delete item</span>
      </Button>
    </div>
  );
}
