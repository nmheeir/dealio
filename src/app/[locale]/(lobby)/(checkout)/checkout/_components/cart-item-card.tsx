import type { CartItem } from '@/api/schemas/cart/cart.schema';
import Image from 'next/image';

import React, { useState } from 'react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/libs/utils';

export function CartItemCard({
  item,
  onUpdateQuantity,
  onRemove,
  isDigital,
  getAvailableStock,
  isPayment = false,
}: {
  item: CartItem;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemove: (itemId: string) => void;
  isDigital: boolean;
  getAvailableStock?: (item: CartItem) => number;
  isPayment?: boolean;
}) {
  const [localQty, setLocalQty] = useState(item.quantity);

  React.useEffect(() => {
    setLocalQty(item.quantity);
  }, [item.quantity]);

  const maxStock = getAvailableStock ? getAvailableStock(item) : Number.MAX_SAFE_INTEGER;

  function clampQuantity(q: number) {
    if (Number.isNaN(q) || q < 1) {
      return 1;
    }
    if (q > maxStock) {
      return maxStock;
    }
    return Math.floor(q);
  }

  function handleSetQuantity(q: number) {
    const clamped = clampQuantity(q);
    setLocalQty(clamped);
    onUpdateQuantity(item.id, clamped);
  }

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm" role="group">
      <div className="flex gap-4">
        {/* Ảnh sản phẩm */}
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted-foreground/10">
          {item.imageUrl
            ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              )
            : (
                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                  No Image
                </div>
              )}
        </div>

        {/* Nội dung */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Style:
                {' '}
                {item.id.slice(0, 8)}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {formatPrice(item.price)}
              </div>
            </div>

            {/* Nút xoá chỉ hiển thị khi KHÔNG ở trạng thái thanh toán */}
            {!isPayment && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(item.id)}
                aria-label="Remove"
              >
                <Icons.trash className="h-4 w-4 text-rose-600" />
              </Button>
            )}
          </div>

          {/* Dòng dưới: màu sắc + số lượng */}
          <div className="mt-3 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Color: —</div>

            {isPayment
              ? (
            // Khi ở checkout/payment: chỉ hiện số lượng
                  <div className="text-sm font-medium">{localQty}</div>
                )
              : isDigital
                ? (
              // Digital: cũng chỉ hiện số lượng
                    <div className="text-sm font-medium">{localQty}</div>
                  )
                : (
              // Bình thường: cho chỉnh sửa số lượng
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => handleSetQuantity(localQty - 1)}
                        disabled={localQty <= 1}
                        aria-label="Decrease"
                      >
                        <Icons.minus className="h-4 w-4" />
                      </Button>
                      <input
                        aria-label="Quantity"
                        type="number"
                        min={1}
                        max={maxStock}
                        value={localQty}
                        onChange={e => handleSetQuantity(Number(e.target.value))}
                        className=" w-14 bg-transparent text-center text-sm font-medium
                             focus:outline-none
                             [&::-webkit-inner-spin-button]:appearance-none
                             [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => handleSetQuantity(localQty + 1)}
                        disabled={localQty >= maxStock}
                        aria-label="Increase"
                      >
                        <Icons.plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
          </div>
        </div>
      </div>
    </div>
  );
}
