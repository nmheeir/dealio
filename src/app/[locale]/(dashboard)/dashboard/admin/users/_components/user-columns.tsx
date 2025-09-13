import type { ColumnDef } from '@tanstack/react-table';
import type { User } from '@/api/schemas/user/user.schema';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { UserRowAction } from './user-row-actions';

export const userColumns: ColumnDef<User>[] = [
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
  {
    accessorKey: 'profile.fullname',
    header: () => <div className="text-left">User</div>,
    cell: ({ row }) => {
      const profile = row.original.profile;
      return (
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.fullname ?? ''} />
            <AvatarFallback>
              {profile?.fullname?.charAt(0).toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            {profile?.fullname ?? '—'}
          </span>
        </div>
      );
    },
    enableGlobalFilter: true,
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.original.role;

      if (role === 'ADMIN') {
        return <Badge className="bg-red-500 text-white hover:bg-red-600">Admin</Badge>;
      }
      if (role === 'MANAGER') {
        return <Badge className="bg-blue-500 text-white hover:bg-blue-600">Manager</Badge>;
      }
      return <Badge className="bg-gray-500 text-white hover:bg-gray-600">Customer</Badge>;
    },
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }) => {
      const active = row.original.is_active;
      return active
        ? (
            <Badge variant="default" className="bg-green-500 hover:bg-green-600">Active</Badge>
          )
        : (
            <Badge variant="destructive">Inactive</Badge>
          );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      const date = createdAt ? new Date(createdAt) : null;
      return (
        <div className="text-sm text-muted-foreground">
          {date ? date.toLocaleString() : '—'}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <UserRowAction user={row.original} />
    ),
  },
];
