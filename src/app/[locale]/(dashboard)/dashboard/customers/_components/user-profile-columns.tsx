import type { ColumnDef } from '@tanstack/react-table';
import type { Customer } from '@/api/schemas/user/customer.schema';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import UserProfileRowAction from './user-profile-row-action';

export const userProfileColumn: ColumnDef<Customer>[] = [
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
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'profile.fullname',
    header: () => <div className="w-full text-left">Name</div>,
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.original.profile?.fullname ?? 'None'}</div>
    ),
    enableHiding: false,
    enableGlobalFilter: true,
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => (
      <Badge variant="secondary">
        {row.original.role}
      </Badge>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      const date = createdAt ? new Date(createdAt) : null;

      return (
        <div className="text-muted-foreground">
          {date ? date.toLocaleString() : '—'}
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <UserProfileRowAction user={row.original} />
    ),
  },
];
