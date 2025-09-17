import type { CartItem } from '@/api/schemas/cart/cart.schema';
import Image from 'next/image';
import React, { useState } from 'react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/libs/utils';

export function CartItemRow({
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
    <tr key={item.id} className="bg-background">
      {/* Cột ảnh + tên */}
      <td className="px-4 py-4 align-top">
        <div className="flex items-start gap-4">
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
          <div className="flex flex-col">
            <div className="font-medium">{item.name}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Style:
              {' '}
              {item.id.slice(0, 8)}
            </div>
          </div>
        </div>
      </td>

      {/* Size, Color giữ nguyên placeholder */}
      <td className="px-4 py-4 align-top">
        <div className="text-sm text-muted-foreground">—</div>
      </td>
      <td className="px-4 py-4 align-top">
        <div className="text-sm text-muted-foreground">—</div>
      </td>

      {/* Giá */}
      <td className="px-4 py-4 text-right align-top">
        <div className="text-sm">{formatPrice(item.price)}</div>
      </td>

      {/* Số lượng */}
      <td className="px-4 py-4 text-center align-top">
        {isPayment
          ? (
        // Khi ở trạng thái thanh toán: chỉ hiển thị số lượng
              <div className="text-sm font-medium">{localQty}</div>
            )
          : isDigital
            ? (
          // Digital: không chỉnh sửa, chỉ hiển thị số
                <div className="text-sm font-medium">{localQty}</div>
              )
            : (
          // Bình thường: có nút chỉnh sửa
                <div className="inline-flex items-center rounded-md border bg-background">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => handleSetQuantity(localQty - 1)}
                    disabled={localQty <= 1}
                    aria-label="Decrease quantity"
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
                    className="w-full [appearance:textfield] text-center text-sm font-medium
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
                    aria-label="Increase quantity"
                  >
                    <Icons.plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
        {maxStock === 0 && !isDigital && !isPayment && (
          <div className="mt-1 text-xs text-red-500">Out of stock</div>
        )}
      </td>

      {/* Tổng */}
      <td className="px-4 py-4 text-right align-top">
        <div className="font-medium">
          {formatPrice(Number(item.price) * localQty)}
        </div>
      </td>

      {/* Xóa */}
      <td className="px-4 py-4 text-center align-top">
        {!isPayment && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(item.product_variant_id)}
            aria-label="Remove item"
          >
            <Icons.trash className="h-4 w-4 text-rose-600" />
          </Button>
        )}
      </td>
    </tr>
  );
}
