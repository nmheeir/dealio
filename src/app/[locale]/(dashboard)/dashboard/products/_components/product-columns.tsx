import type { ColumnDef } from '@tanstack/react-table';
import type { Product } from '@/api/schemas/product/product.schema';
import { DragHandle } from '@/components/dashboard/table/drag-handle';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ProductViewerRow } from './product-viewer-row';

export const productColumns: ColumnDef<Product>[] = [
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
    header: () => <div className="w-full  text-left">Product</div>,
    cell: ({ row }) => (
      <ProductViewerRow item={row.original} />
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'type',
    header: () => <div className="w-full text-center">Type</div>,
    cell: ({ row }) => (
      <div className="flex justify-center ">
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {row.original.product_type}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: () => <div className="w-full  text-center">Status</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {row.original.status}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'slug',
    header: () => <div className="w-full text-center">Slug</div>,
    cell: ({ row }) => (
      <div className="flex justify-center ">
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {row.original.slug}
        </Badge>
      </div>
    ),
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: () => (
      // <RowActions item={row.original} />
      <Icons.ellipsisVertical className="size-4" />
    ),
  },
];
