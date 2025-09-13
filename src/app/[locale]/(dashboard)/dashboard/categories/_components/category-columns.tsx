import type { ColumnDef } from '@tanstack/react-table';
import type { Category } from '@/api/schemas/category/category.schema';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { CategoryRowActions } from './category-row-action';
import { CategoryViewerRow } from './category-viewer-row';

export const categoryColumn: ColumnDef<Category>[] = [
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
    accessorKey: 'name',
    header: () => <div className="w-full text-left">Category Name</div>,
    cell: ({ row }) => <CategoryViewerRow item={row.original} />,
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
    cell: ({ row }) => (
      <CategoryRowActions item={row.original} />
    ),
  },
];
