import type { Category } from '@/api/schemas/category/category.schema';
import { Separator } from '@radix-ui/react-separator';
import { IconDotsVertical } from '@tabler/icons-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RowActionDelete } from './category-row-action-delete';
import { RowActionEdit } from './category-row-action-edit';

type RowActionsProps = {
  item: Category;
};

export function CategoryRowActions({ item }: RowActionsProps) {
  return (
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
        <Separator />
        <RowActionEdit item={item} />
        <RowActionDelete item={item} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
