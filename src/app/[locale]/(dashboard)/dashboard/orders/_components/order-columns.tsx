import type { ColumnDef } from '@tanstack/react-table';
import type { Order } from '@/api/schemas/order/order.schema';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import OrderRowAction from './order-row-action';

function formatCurrency(value: string | number): string {
  const num = typeof value === 'string' ? Number.parseFloat(value) : value;
  return num.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

function formatDate(value: string): string {
  const date = new Date(value);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const orderStatusColor: Record<string, string> = {
  PENDING_CONFIRMATION: 'bg-yellow-100 text-yellow-800',
  PENDING_PAYMENT: 'bg-orange-100 text-orange-800',
  PAID: 'bg-blue-100 text-blue-800',
  CONFIRMED: 'bg-indigo-100 text-indigo-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-teal-100 text-teal-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELED: 'bg-red-100 text-red-800',
  FAILED: 'bg-red-200 text-red-900',
  RETURNED: 'bg-gray-200 text-gray-800',
};

export const orderColumns: ColumnDef<Order>[] = [
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
  // Order code
  {
    accessorKey: 'order_code',
    header: () => <div className="text-center">Mã đơn</div>,
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.original.order_code ?? 'None'}</div>
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
          <Badge
            className={`${orderStatusColor[status]} rounded-full px-2 py-0.5`}
          >
            {status}
          </Badge>
        </div>
      );
    },
  },
  // Order type
  {
    accessorKey: 'order_type',
    header: () => <div className="text-center">Loại đơn</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.order_type}</div>
    ),
  },
  // Subtotal, discount, shipping, total
  {
    id: 'amounts',
    header: () => <div className="text-right">Tổng tiền</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <div className="text-sm">
          Tạm tính:
          {formatCurrency(row.original.sub_total)}
        </div>
        <div className="text-sm">
          Giảm giá:
          {formatCurrency(row.original.discount_amount)}
        </div>
        <div className="text-sm">
          Ship:
          {formatCurrency(row.original.shipping_fee)}
        </div>
        <div className="font-semibold">
          {formatCurrency(row.original.total_amount)}
        </div>
      </div>
    ),
  },
  // Dates
  {
    id: 'createdAt',
    header: () => <div className="text-center">Ngày đặt</div>,
    cell: ({ row }) => (
      <div className="text-center text-sm">
        {formatDate(row.original.createdAt)}
      </div>
    ),
  },
  {
    id: 'expiredAt',
    header: () => <div className="text-center">Hết hạn</div>,
    cell: ({ row }) =>
      row.original.expired_at
        ? (
            <div className="text-center text-sm text-muted-foreground">
              {formatDate(row.original.expired_at)}
            </div>
          )
        : (
            <div className="text-center text-sm text-muted-foreground">—</div>
          ),
  },

  // Actions
  {
    id: 'actions',
    cell: ({ row }) => <OrderRowAction item={row.original} />,
  },
];
