'use client';

import React from 'react';
import ProductListingPage from '@/app/[locale]/(lobby)/products/_components/plp';
import FacetsDesktop from '../filters/facets-desktop';
import SearchToolbar from './search-toolbar';

export default function SearchView() {
  return (
    <div>
      {/* Mobile filter drawer */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div>Con cac</div>
        <div className="flex items-center justify-between border-b border-gray-200 pt-6 pb-6">
          {/* Base on url */}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">SKIBIDI</h1>
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
            <ProductListingPage />
          </div>
        </section>
      </main>
    </div>
  );
}
