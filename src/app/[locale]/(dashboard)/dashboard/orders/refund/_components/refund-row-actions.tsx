'use client';

import type { Refund } from '@/api/schemas/refund/refund.schema';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import RefundDetailsDialog from './actions/refund-details-dialog';

export function RefundRowActions({ item }: { item: Refund }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          ⋮
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <RefundDetailsDialog refund={item} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
