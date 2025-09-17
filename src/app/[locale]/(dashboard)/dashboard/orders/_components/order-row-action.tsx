/* eslint-disable no-console */
'use client';

import type { Order } from '@/api/schemas/order/order.schema';
import { Gamepad2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CancelOrder } from './actions/cancel-order';
import { ResendPaymentLink } from './actions/resend-payment-link';
import { UpdateAddress } from './actions/update-order-address';
import { ViewOrderDetail } from './actions/view-order-detail';

// UC02-093: Xem mã game
function ViewGameCode({ item }: { item: Order }) {
  if (!(item.order_type === 'DIGITAL' && item.status === 'COMPLETED')) {
    return null;
  }

  return (
    <DropdownMenuItem
      onClick={() => console.log('Xem mã game cho đơn', item.id)}
      className="cursor-pointer"
    >
      <Gamepad2 className="mr-2 h-4 w-4" />
      Xem mã game
    </DropdownMenuItem>
  );
}

// === Dropdown Container ===
export default function OrderRowAction({ item }: { item: Order }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <ViewOrderDetail item={item} />
        <ResendPaymentLink item={item} />
        <CancelOrder item={item} />
        <ViewGameCode item={item} />
        <UpdateAddress item={item} />

        {/* Nếu không có action nào khả dụng */}
        {!(
          <ResendPaymentLink item={item} />
          || <CancelOrder item={item} />
          || <ViewGameCode item={item} />
          || <UpdateAddress item={item} />
        ) && <DropdownMenuItem disabled>Không có hành động</DropdownMenuItem>}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
