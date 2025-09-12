import type { ProductVariant } from '@/api/schemas/product/product-variant.schema';
import React from 'react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ProductVariantDialog } from './variant-view-content';

export function VariantRowActionView({ item }: { item: ProductVariant }) {
  return (
    <>
      <DropdownMenuItem onClick={(e) => {
        e.preventDefault();
      }}
      >
        <ProductVariantDialog variant={item} />
      </DropdownMenuItem>
    </>
  );
}
