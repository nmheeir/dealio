import type { ColumnDef } from '@tanstack/react-table';
import type { Brand } from '@/api/schemas/brand/brand.schema';
import { DragHandle } from '@/components/dashboard/table/drag-handle';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { BrandRowActions } from './brand-row-action';
import { BrandViewerRow } from './brand-viewer-row';

export const brandColumns: ColumnDef<Brand>[] = [
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
      return <BrandViewerRow item={row.original} />;
    },
    enableHiding: false,
  },
  {
    accessorKey: 'slug',
    header: () => <div className="w-full  text-center">Slug</div>,
    cell: ({ row }) => (
      <div className="flex justify-center ">
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {row.original.slug}
        </Badge>
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      // <RowActions item={row.original} />
      <BrandRowActions item={row.original} />
    ),
  },
];
