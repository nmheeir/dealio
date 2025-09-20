import type { ColumnDef } from '@tanstack/react-table';
import type { Order } from '@/api/schemas/order/order.schema';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { formatCurrency, formatDate, orderStatusColor, paymentMethodColor } from '../../../orders/_components/utils';
import ManagerOrderRowAction from './manage-order-row-actions';

export const managerOrderColumns: ColumnDef<Order>[] = [
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
  {
    accessorKey: 'payment_method',
    header: () => <div className="text-center">Thanh toán</div>,
    cell: ({ row }) => {
      const paymentMethod = row.original.payment_method;
      return (
        <div className="flex justify-center">
          <Badge
            className={`${paymentMethodColor[paymentMethod]} rounded-full px-2 py-0.5`}
          >
            {paymentMethod}
          </Badge>
        </div>
      );
    },
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
    cell: ({ row }) => <ManagerOrderRowAction item={row.original} />,
  },
];
