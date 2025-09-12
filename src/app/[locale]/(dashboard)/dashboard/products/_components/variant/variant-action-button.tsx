'use client';

import type { ProductVariant } from '@/api/schemas/product/product-variant.schema';
import { IconDotsVertical } from '@tabler/icons-react';
import React from 'react';
import { ProductType } from '@/api/schemas/product/product.schema';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { VariantActionCsv } from './variant-action-csv';
import { VariantActionStock } from './variant-action-stock';
import { VariantRowActionView } from './variant-action-view';

export function VariantActionButton({ item }: { item: ProductVariant }) {
  const [open, setOpen] = React.useState(false);
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
        {item.product.product_type === ProductType.CARD_DIGITAL_KEY
          && <VariantActionCsv item={item} />}
        {[ProductType.DEVICE, ProductType.CARD_PHYSICAL].includes(
          item.product.product_type,
        ) && (
          <DropdownMenuItem onClick={() => setOpen(true)}>
            Add Stock
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>

      <VariantActionStock
        variantId={item.id}
        open={open}
        onOpenChange={setOpen}
        currentStock={item.stock?.quantity ?? 0}
      />
    </DropdownMenu>
  );
}
