'use client';

import { parseAsInteger, useQueryState } from 'nuqs';
import React from 'react';
import { useProductFilter } from '@/api/products/use-product-filter';
import { AlertCard } from '@/components/alert-card';
import { ErrorCard } from '@/components/error-card';
import { ProductCard } from '@/components/product-card';
import SearchPagination from '@/components/search/search-pagination';
import PLPLoading from './plp-loading';

type ProductListingPageProps = {
  query?: string | null;
};

export default function ProductListingPage({ query }: ProductListingPageProps) {
  const [brandSlug] = useQueryState('brand', {
    defaultValue: '',
  });
  const [categorySlug] = useQueryState('category', {
    defaultValue: '',
  });
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [orderBy] = useQueryState('orderBy', {
    defaultValue: '',
    clearOnDefault: true,
  });
  const order = orderBy === 'asc' ? 'ASC' : orderBy === 'desc' ? 'DESC' : 'ASC';

  const { data, isLoading, error } = useProductFilter(
    { variables: {
      brandSlug,
      categorySlug,
      request: {
        order,
        limit: 8,
      },
    } },
  );

  if (isLoading) {
    return <PLPLoading />;
  }

  if (error || !data) {
    return (
      <div className="flex grow flex-col lg:col-span-3">
        <div className="col-span-4 flex min-h-[300px] w-full items-center justify-center">
          <ErrorCard
            title={error?.message || 'Error loading products'}
            description={error?.message || 'Something went wrong while fetching products.'}
            className="w-full max-w-xl"
          />
        </div>
      </div>
    );
  }

  const paginationProductVariants = data.data;
  const products = paginationProductVariants.data;

  if (products.length === 0) {
    return (
      <div className="flex grow flex-col lg:col-span-3">
        <div className="col-span-4 flex min-h-[300px] items-center justify-center">
          <AlertCard title="No product find" className="border-none" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex grow flex-col lg:col-span-3">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Your content Product Display */}
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {/* Paging placeholder */}
      <SearchPagination
        currentPage={page}
        totalPages={Math.ceil(paginationProductVariants.pageCount)}
        onPageChangeAction={(p) => {
          setPage(p);
        }}
      />
    </div>
  );
}
