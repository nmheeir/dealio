import type { Product } from '@/api/schemas/product/product.schema';
import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/ui/button';

export function ProductViewerRow({ item }: { item: Product }) {
  return (
    <Button
      variant="link"
      className="cursor-pointer text-sm font-medium text-primary transition-colors hover:underline"
    >
      <Link href={`products/${item.id}`}>
        {item.name}
      </Link>
    </Button>
  );
}
