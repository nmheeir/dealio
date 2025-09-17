/* eslint-disable no-console */
'use client';

import type { Order } from '@/api/schemas/order/order.schema';
import { CreditCard, Gamepad2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CancelOrder } from './actions/cancel-order';
import { UpdateAddress } from './actions/update-order-address';
import { ViewOrderDetail } from './actions/view-order-detail';

// === Action Items ===

// UC02-091: Lấy lại link thanh toán
function ResendPaymentLink({ item }: { item: Order }) {
  if (item.status !== 'PENDING_PAYMENT') {
    return null;
  }

  return (
    <DropdownMenuItem
      onClick={() => console.log('Lấy lại link thanh toán cho', item.id)}
      className="cursor-pointer"
    >
      <CreditCard className="mr-2 h-4 w-4" />
      Lấy lại link thanh toán
    </DropdownMenuItem>
  );
}

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
