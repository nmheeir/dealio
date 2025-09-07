'use client';

import type { Table } from '@tanstack/react-table';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type TableToolbarProps<TData> = {
  table: Table<TData>;
  onAddSectionAction?: () => void;
};

export function TableToolbar<TData>({ table, onAddSectionAction }: TableToolbarProps<TData>) {
  return (
    <div className="flex items-center gap-2">
      {/* Customize Columns */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Icons.columns2 className="mr-2 h-4 w-4" />
            <span className="hidden lg:inline">Customize Columns</span>
            <span className="lg:hidden">Columns</span>
            <Icons.chevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {table
            .getAllColumns()
            .filter(
              column =>
                typeof column.accessorFn !== 'undefined' && column.getCanHide(),
            )
            .map(column => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={value => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Add Section */}
      <Button variant="outline" size="sm" onClick={onAddSectionAction}>
        <Icons.plus className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline">Add Section</span>
        <span className="lg:hidden">Add</span>
      </Button>
    </div>
  );
}
