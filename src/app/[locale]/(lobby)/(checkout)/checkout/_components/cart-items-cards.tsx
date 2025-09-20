import type { CartItem } from '@/api/schemas/cart/cart.schema';
import { CartItemCard } from './cart-item-card';

export function CartItemsCards({
  items,
  onUpdateQuantity,
  onRemove,
  isDigital,
  getAvailableStock,
  isPayment = false,
}: {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemove: (itemId: string) => void;
  isDigital: boolean;
  getAvailableStock?: (item: CartItem) => number;
  isPayment?: boolean;
}) {
  return (
    <div className="space-y-4">
      {items.map(item => (
        <CartItemCard
          key={item.id}
          item={item}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemove}
          isDigital={isDigital}
          getAvailableStock={getAvailableStock}
          isPayment={isPayment}
        />
      ))}
    </div>
  );
}
