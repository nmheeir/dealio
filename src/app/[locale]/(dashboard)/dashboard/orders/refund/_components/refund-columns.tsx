import type { ColumnDef } from '@tanstack/react-table';
import type { Refund } from '@/api/schemas/refund/refund.schema';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDate } from '@/libs/utils';
import { formatCurrency } from '../../_components/utils';
import { RefundRowActions } from './refund-row-actions';

const refundStatusColor: Record<Refund['status'], string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-blue-100 text-blue-800',
  REJECTED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-green-100 text-green-800',
};

export const refundColumns: ColumnDef<Refund>[] = [
  // Checkbox
  {
    id: 'select',
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected()
            || (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // Reason
  {
    accessorKey: 'reason',
    header: () => <div className="text-center">Lý do</div>,
    cell: ({ row }) => (
      <div className="text-center text-sm">{row.original.reason}</div>
    ),
  },

  // Amount
  {
    accessorKey: 'amount',
    header: () => <div className="text-center">Số tiền hoàn lại</div>,
    cell: ({ row }) => {
      const amount = row.original.amount;
      return (
        <div className="text-center font-medium">
          {amount != null ? formatCurrency(amount) : '-'}
        </div>
      );
    },
  },

  // Status
  {
    accessorKey: 'status',
    header: () => <div className="text-center">Trạng thái</div>,
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="flex justify-center">
          <Badge
            className={`${refundStatusColor[status]} rounded-full px-2 py-0.5`}
          >
            {status}
          </Badge>
        </div>
      );
    },
  },

  // Review Notes
  {
    accessorKey: 'reviewNotes',
    header: () => <div className="text-center">Ghi chú</div>,
    cell: ({ row }) => (
      <div className="text-center text-sm">
        {row.original.reviewNotes ?? '-'}
      </div>
    ),
  },

  // Reviewed At
  {
    accessorKey: 'reviewedAt',
    header: () => <div className="text-center">Ngày duyệt</div>,
    cell: ({ row }) => (
      <div className="text-center text-sm">
        {row.original.reviewedAt ? formatDate(row.original.reviewedAt) : '-'}
      </div>
    ),
  },

  // Created date
  {
    id: 'createdAt',
    header: () => <div className="text-center">Ngày tạo</div>,
    cell: ({ row }) => (
      <div className="text-center text-sm">
        {formatDate(row.original.createdAt)}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <RefundRowActions item={row.original} />
    ),
  },
];
