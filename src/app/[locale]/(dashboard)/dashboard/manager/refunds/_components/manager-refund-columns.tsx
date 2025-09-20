import type { ColumnDef } from '@tanstack/react-table';
import type { RefundRequest } from '@/api/schemas/refund/refund-request.schema';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDate } from '@/libs/utils';
import ManagerRefundRowActions from './manager-refund-row-actions';

// Lấy type từ schema

const refundStatusColor: Record<RefundRequest['status'], string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
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

  // Refund ID
  // {
  //   accessorKey: 'id',
  //   header: () => <div className="text-center">Mã yêu cầu</div>,
  //   cell: ({ row }) => (
  //     <div className="text-center font-medium">{row.original.id}</div>
  //   ),
  // },

  // Order code
  {
    id: 'orderCode',
    header: () => <div className="text-center">Mã đơn hàng</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.order?.order_code ?? '-'}
      </div>
    ),
  },

  // User (customer)
  {
    id: 'customer',
    header: () => <div className="text-center">Khách hàng</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.user?.email ?? row.original.user?.id ?? '-'}
      </div>
    ),
  },

  // Reason
  {
    accessorKey: 'reason',
    header: () => <div className="text-center">Lý do</div>,
    cell: ({ row }) => (
      <div className="text-center text-sm">{row.original.reason}</div>
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

  // Actions
  {
    id: 'actions',
    cell: ({ row }) => <ManagerRefundRowActions item={row.original} />,
  },
];
