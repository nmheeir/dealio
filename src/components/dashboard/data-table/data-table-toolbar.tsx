'use client';

import type { Table } from '@tanstack/react-table';
import { IconChevronDown, IconLayoutColumns } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type DataTableToolbarProps<TData> = {
  table: Table<TData>;
};

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const globalFilter = table.getState().globalFilter ?? '';

  return (
    <div className="flex items-center justify-between space-x-2">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search..."
          value={globalFilter as string}
          onChange={e => table.setGlobalFilter(e.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {globalFilter
          ? (
              <Button
                variant="ghost"
                onClick={() => table.setGlobalFilter('')}
                className="h-8 px-2 lg:px-3"
              >
                Reset
              </Button>
            )
          : null}
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
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
    </div>
  );
}
