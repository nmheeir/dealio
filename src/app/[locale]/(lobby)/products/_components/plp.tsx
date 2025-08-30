/* eslint-disable react/no-array-index-key */
'use client';

import { useQueryState } from 'nuqs';

import React from 'react';
import { ProductCardSkeleton } from '@/components/product-card-skeleton';

export default function ProductListingPage() {
  const [brand] = useQueryState('brand');
  const [category] = useQueryState('category');

  return (
    <div className="flex grow flex-col lg:col-span-3">
      {brand}
      {' '}
      {category}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Your content Product Display */}
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
      {/* Paging placeholder */}
      <div className="mt-8 flex justify-center bg-red-200">
        <div className="rounded border border-dashed border-gray-400 px-6 py-2 text-gray-500">[Paging Placeholder]</div>
      </div>
    </div>
  );
}
