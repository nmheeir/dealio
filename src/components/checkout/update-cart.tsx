'use client';

import type { CartLineItemSchema } from '@/libs/validations/cart';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '../icons';

type UpdateCartProps = {
  cartLineItem?: CartLineItemSchema;
};

export function UpdateCart({ cartLineItem }: UpdateCartProps) {
  const id = React.useId();

  return (
    <div className="flex w-full items-center justify-between space-x-2">
      <div className="flex items-center">
        {/* Nút giảm */}
        <Button
          id={`${id}-decrement`}
          variant="outline"
          size="icon"
          className="size-8 rounded-r-none"
        >
          <Icons.minus className="size-3" aria-hidden="true" />
          <span className="sr-only">Remove one item</span>
        </Button>

        {/* Input số lượng (hardcode từ cartLineItem.quantity) */}
        <Input
          id={`${id}-quantity`}
          type="number"
          min="0"
          className="h-8 w-14 rounded-none border-x-0"
          value={100}
          readOnly
        />

        {/* Nút tăng */}
        <Button
          id={`${id}-increment`}
          variant="outline"
          size="icon"
          className="size-8 rounded-l-none"
        >
          <Icons.plus className="size-3" aria-hidden="true" />
          <span className="sr-only">Add one item</span>
        </Button>
      </div>

      {/* Nút xóa */}
      <Button
        id={`${id}-delete`}
        variant="outline"
        size="icon"
        className="size-8"
      >
        <Icons.trash className="size-3" aria-hidden="true" />
        <span className="sr-only">Delete item</span>
      </Button>
    </div>
  );
}
