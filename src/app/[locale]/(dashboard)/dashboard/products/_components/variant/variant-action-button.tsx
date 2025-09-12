'use client';

import type { ProductVariant } from '@/api/schemas/product/product-variant.schema';
import { IconDotsVertical } from '@tabler/icons-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { VariantActionCsv } from './variant-action-csv';
import { VariantRowActionView } from './variant-action-view';

export function VariantActionButton({ item }: { item: ProductVariant }) {
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
        {/* <RowActionDelete item={item} /> */}
        <VariantRowActionView item={item} />
        <VariantActionCsv item={item} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
