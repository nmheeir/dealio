// components/data-table/columns.tsx
import type { ColumnDef } from '@tanstack/react-table';
import type { ProductVariant } from '@/api/schemas/product/product-variant.schema';
import {
  IconDotsVertical,
} from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { DragHandle } from './drag-handle';
import { TableCellViewer } from './table-cell-viewer';

export const columns: ColumnDef<ProductVariant>[] = [
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
    header: () => <div className="w-full  text-left">Variant Name</div>,
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />;
    },
    enableHiding: false,
  },
  {
    accessorKey: 'price',
    header: () => <div className="w-full  text-center">Price</div>,
    cell: ({ row }) => (
      <div className="flex justify-center ">
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {row.original.price}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'cost-price',
    header: () => <div className="w-full text-center">Cost Price</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {row.original.cost_price}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'sku',
    header: () => <div className="w-full  text-center">SKU</div>,
    cell: ({ row }) => (
      <div className="flex justify-center ">
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {row.original.sku}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'stock',
    header: () => <div className="w-24 text-center">Stock</div>,
    cell: ({ row }) => (
      <div className="flex w-24 justify-center">
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {row.original.price}
        </Badge>
      </div>
    ),
  },
  {
    id: 'actions',
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Make a copy</DropdownMenuItem>
          <DropdownMenuItem>Favorite</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
