'use client';

import { parseAsInteger, useQueryState } from 'nuqs';
import React from 'react';
import { useProducts } from '@/api/products/use-products';
import { AlertCard } from '@/components/alert-card';
import { ProductCard } from '@/components/product-card';
import SearchPagination from '@/components/search/search-pagination';
import PLPLoading from './plp-loading';

type ProductListingPageProps = {
  query?: string | null;
};

export default function ProductListingPage({ query }: ProductListingPageProps) {
  const [brand] = useQueryState('brand');
  const [category] = useQueryState('category');
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));

  const { data, isLoading, error } = useProducts({ variables: {
    name: query,
    brand,
    category,
    page,
  } });

  if (isLoading) {
    return <PLPLoading />;
  }

  if (error || !data) {
    return (
      <AlertCard />
    );
  }

  const paginationProductVariants = data.data;
  const productVariants = paginationProductVariants.data;

  if (productVariants.length === 0) {
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Your content Product Display */}
        {productVariants.map(variant => (
          <ProductCard key={variant.id} product={variant} />
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
