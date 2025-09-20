// --- manager-refund-columns.tsx ---
import type { ColumnDef } from '@tanstack/react-table';
import type { RefundRequest } from '@/api/schemas/refund/refund-request.schema';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDate } from '@/libs/utils';
import ManagerRefundRowActions from './manager-refund-row-actions';

const refundStatusColor: Record<RefundRequest['status'], string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
};

export const managerRefundColumns: ColumnDef<RefundRequest>[] = [
  // Checkbox select
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

  // Order total amount
  {
    id: 'totalAmount',
    header: () => <div className="text-center">Số tiền đơn hàng</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.order?.total_amount
          ? `${row.original.order.total_amount} VND`
          : '-'}
      </div>
    ),
  },

  // Status
  {
    accessorKey: 'status',
    header: () => <div className="text-center">Trạng thái</div>,
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="flex justify-center">
          <Badge className={`${refundStatusColor[status]} rounded-full px-2 py-0.5`}>
            {status}
          </Badge>
        </div>
      );
    },
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

  // Reviewed date
  {
    id: 'reviewedAt',
    header: () => <div className="text-center">Ngày duyệt</div>,
    cell: ({ row }) => (
      <div className="text-center text-sm">
        {row.original.reviewedAt ? formatDate(row.original.reviewedAt) : '-'}
      </div>
    ),
  },

  // Finalized date
  {
    id: 'finalizedAt',
    header: () => <div className="text-center">Ngày hoàn tất</div>,
    cell: ({ row }) => (
      <div className="text-center text-sm">
        {row.original.finalizedAt ? formatDate(row.original.finalizedAt) : '-'}
      </div>
    ),
  },

  // Actions
  {
    id: 'actions',
    cell: ({ row }) => <ManagerRefundRowActions item={row.original} />,
  },
];
