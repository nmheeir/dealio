import type { ColumnDef } from '@tanstack/react-table';
import type { Category } from '@/api/schemas/category/category.schema';
import { DragHandle } from '@/components/dashboard/data-table/drag-handle';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

export const categoryColumn: ColumnDef<Category>[] = [
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
    header: () => <div className="w-full  text-left">Category Name</div>,
    cell: ({ row }) => {
      return <div className="">{row.original.name}</div>;
    },
    enableHiding: false,
  },
  {
    accessorKey: 'seo_description',
    header: () => <div className="w-full  text-center">Seo Description</div>,
    cell: ({ row }) => (
      <div className="flex justify-center ">
        {row.original.seo_description}
      </div>
    ),
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
    cell: () => (
      // <RowActions item={row.original} />
      <Icons.ellipsisVertical className="size-4" />
    ),
  },
];
