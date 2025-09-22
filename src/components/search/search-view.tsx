'use client';

import React from 'react';
import ProductListingPage from '@/app/[locale]/(lobby)/search/_components/plp';
import { Breadcrumbs } from '../breadcrumbs';
import FacetsDesktop from '../filters/facets-desktop';
import SearchToolbar from './search-toolbar';

type SearchViewProps = {
  query?: string | null;
};

export default function SearchView({ query }: SearchViewProps) {
  return (
    <div>
      {/* Mobile filter drawer */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mt-4">
          <Breadcrumbs items={makeBreadcrumbs(query)} />
        </div>
        <div className="flex items-center justify-between border-b border-gray-200 pt-6 pb-6">
          {/* Base on url */}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {query
              ? (
                  <>
                    Search results for
                    {' '}
                    <span className="text-blue-600 dark:text-blue-400">
                      "
                      {query}
                      "
                    </span>
                  </>
                )
              : (
                  'All Products'
                )}
          </h1>

          <SearchToolbar />
        </div>

        <section aria-labelledby="products-heading" className="pt-6 pb-24">
          <h2 id="products-heading" className="sr-only">
            Products
          </h2>
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            {/* filter */}
            <FacetsDesktop className="hidden lg:block" />

            {/* Product grid */}
            <ProductListingPage query={query} />
          </div>
        </section>
      </main>
    </div>
  );
}

function makeBreadcrumbs(query?: string | null) {
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Search', href: '/search' },
  ];

  if (query) {
    crumbs.push({
      name: `"${query}"`,
      href: `/search?q=${encodeURIComponent(query)}`,
    });
  }

  return crumbs;
}
