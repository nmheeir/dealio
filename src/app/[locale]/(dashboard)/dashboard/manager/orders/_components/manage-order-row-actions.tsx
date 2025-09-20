'use client';

import type { Order } from '@/api/schemas/order/order.schema';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ViewOrderDetail } from '../../../orders/_components/actions/view-order-detail';
import { ManagerCancelOrder } from './actions/manager-cancel-order';
import { ManagerConfirmOrder } from './actions/manager-confirm-order';
import { ManagerShipOrder } from './actions/manager-ship-order';

// === Dropdown Container ===
export default function ManagerOrderRowAction({ item }: { item: Order }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <ViewOrderDetail item={item} />
        <ManagerCancelOrder item={item} />
        <ManagerConfirmOrder item={item} />
        <ManagerShipOrder item={item} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
