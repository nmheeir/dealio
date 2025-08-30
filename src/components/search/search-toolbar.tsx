'use client';

import { useQueryState } from 'nuqs';
import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/libs/utils';
import FacetsMobile from '../filters/facets-mobile';
import { Icons } from '../icons';
import { Button } from '../ui/button';

const sortOptions = [
  { name: 'Most Popular', slug: 'popular', href: '#', current: true },
  { name: 'Best Rating', slug: 'rating', href: '#', current: false },
  { name: 'Newest', slug: 'newest', href: '#', current: false },
  { name: 'Price: Low to High', slug: 'price-asc', href: '#', current: false },
  { name: 'Price: High to Low', slug: 'price-desc', href: '#', current: false },
];

export default function SearchToolbar() {
  const [_sort, setSort] = useQueryState('sort', {
    defaultValue: '',
    clearOnDefault: true,
  });

  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="group inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
          <div>
            <Button variant="outline">
              Sort
              <Icons.chevronDown />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className={cn(
            'z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in',
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
                onClick={() => setSort(option.slug)}
              >
                {option.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <button type="button" className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
        {/* TODO: Trigger content display type */}
        <span className="sr-only">View grid</span>
        <Icons.grid2x2 aria-hidden="true" className="size-5" />
      </button>
      <FacetsMobile />
    </div>
  );
}
