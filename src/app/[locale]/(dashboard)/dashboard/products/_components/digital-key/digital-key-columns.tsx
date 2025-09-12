import type { ColumnDef } from '@tanstack/react-table';
import type { DigitalKey } from '@/api/schemas/digital-key/digital-key.schema';
import { DragHandle } from '@/components/dashboard/table/drag-handle';
import { Checkbox } from '@/components/ui/checkbox';

export const digitalKeyColumns: ColumnDef<DigitalKey>[] = [
  {
    id: 'drag',
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
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
    accessorKey: 'header',
    header: () => <div className="w-full  text-left">Brand Name</div>,
    cell: ({ row }) => {
      return <div>{row.original.key_code}</div>;
    },
    enableHiding: false,
  },
  {
    id: 'status',
    cell: ({ row }) => (
      // <RowActions item={row.original} />
      <div>{row.original.status}</div>
    ),
  },
  {
    id: 'active_at',
    cell: ({ row }) => (
      // <RowActions item={row.original} />
      <div>{row.original.active_at}</div>
    ),
  },
  {
    id: 'actions',
    // cell: ({ }) => (
    //   // <RowActions item={row.original} />
    //   <
    // )
  },
];
