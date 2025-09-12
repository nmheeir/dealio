import type { ProductVariant } from '@/api/schemas/product/product-variant.schema';
import React from 'react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { VariantActionCsvContent } from './variant-csv-content';

export function VariantActionCsv({ item }: { item: ProductVariant }) {
  return (
    <>
      <DropdownMenuItem onClick={(e) => {
        e.preventDefault();
      }}
      >
        <VariantActionCsvContent item={item} />
      </DropdownMenuItem>
    </>
  );
}
