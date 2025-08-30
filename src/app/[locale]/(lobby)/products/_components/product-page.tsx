'use client';

import React from 'react';
import FacetsContent from '@/components/filters/facets-content';
import { Icons } from '@/components/icons';
import { ProductCardSkeleton } from '@/components/product-card-skeleton';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/libs/utils';

const sortOptions = [
  { name: 'Most Popular', href: '#', current: true },
  { name: 'Best Rating', href: '#', current: false },
  { name: 'Newest', href: '#', current: false },
  { name: 'Price: Low to High', href: '#', current: false },
  { name: 'Price: High to Low', href: '#', current: false },
];

// TODO: Need import data

export default function ProductList() {
  const [_mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);

  return (
    <div>
      {/* Mobile filter drawer */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b border-gray-200 pt-6 pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">SKIBIDI</h1>
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                <div>
                  <Button variant="outline">
                    Sort
                    <Icons.chevronDown />
                  </Button>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className={cn(
                  'absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in',
                )}
              >
                <DropdownMenuGroup className="py-1">
                  {sortOptions.map(option => (
                    <DropdownMenuItem
                      key={option.name}
                      className={cn(
                        option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                        'block px-4 py-2 text-sm data-focus:bg-gray-100 data-focus:outline-hidden',
                      )}
                    >
                      {option.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <button type="button" className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
              <span className="sr-only">View grid</span>
              <Icons.grid2x2 aria-hidden="true" className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
            >
              <span className="sr-only">Filters</span>
              <Icons.funnel aria-hidden="true" className="size-5" />
            </button>
          </div>
        </div>

        <section aria-labelledby="products-heading" className="pt-6 pb-24">
          <h2 id="products-heading" className="sr-only">
            Products
          </h2>
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            {/* filter */}
            <FacetsContent />

            {/* Product grid */}
            <div className="flex grow flex-col lg:col-span-3">
              <div className="grid grid-cols-1 gap-6 bg-blue-200 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {/* Your content */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
              {/* Paging placeholder */}
              <div className="mt-8 flex justify-center bg-red-200">
                <div className="rounded border border-dashed border-gray-400 px-6 py-2 text-gray-500">[Paging Placeholder]</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
