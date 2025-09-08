// components/data-table/DataTableHeader.tsx
import type { Table } from '@tanstack/react-table';
import type { ProductVariant } from '@/api/schemas/product/product-variant.schema';
import {
  IconChevronDown,
  IconLayoutColumns,
} from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

type DataTableHeaderProps = {
  table: Table<ProductVariant>;
};

export function DataTableToolbar({ table }: DataTableHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 lg:px-6">
      <Label htmlFor="view-selector" className="sr-only">
        View
      </Label>
      <Select defaultValue="outline">
        <SelectTrigger
          className="flex w-fit @4xl/main:hidden"
          size="sm"
          id="view-selector"
        >
          <SelectValue placeholder="Select a view" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="outline">Outline</SelectItem>
          <SelectItem value="past-performance">Past Performance</SelectItem>
          <SelectItem value="key-personnel">Key Personnel</SelectItem>
          <SelectItem value="focus-documents">Focus Documents</SelectItem>
        </SelectContent>
      </Select>
      <TabsList className="hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1 @4xl/main:flex">
        <TabsTrigger value="outline">Outline</TabsTrigger>
        <TabsTrigger value="past-performance">
          Past Performance
          {' '}
          <Badge variant="secondary">3</Badge>
        </TabsTrigger>
        <TabsTrigger value="key-personnel">
          Key Personnel
          {' '}
          <Badge variant="secondary">2</Badge>
        </TabsTrigger>
        <TabsTrigger value="focus-documents">Focus Documents</TabsTrigger>
      </TabsList>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <IconLayoutColumns />
              <span className="hidden lg:inline">Customize Columns</span>
              <span className="lg:hidden">Columns</span>
              <IconChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {table
              .getAllColumns()
              .filter(
                column =>
                  typeof column.accessorFn !== 'undefined'
                  && column.getCanHide(),
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={value =>
                      column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* <Button variant="outline" size="sm">
          <IconPlus />
          <span className="hidden lg:inline">Add Section</span>
        </Button> */}
      </div>
    </div>
  );
}
