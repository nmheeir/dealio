import type { RefundRequest } from '@/api/schemas/refund/refund-request.schema';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,

  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import RefundActionHandler from './actions/refund-action-handler';
import RefundRequestDetailDialog from './actions/refund-request-detail-dialog';

type ManagerRefundRowActionsProps = {
  item: RefundRequest;
};

export default function ManagerRefundRowActions({ item }: ManagerRefundRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Mở menu</span>
          <Icons.ellipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <RefundRequestDetailDialog item={item} />
        <RefundActionHandler item={item} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
