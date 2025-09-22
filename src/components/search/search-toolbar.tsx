'use client';

import { useQueryState } from 'nuqs';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/libs/utils';
import FacetsMobile from '../filters/facets-mobile';
import { Icons } from '../icons';
import { Button } from '../ui/button';

const sortOptions = [
  { name: 'Newest', slug: 'desc', sortBy: 'createAt', order: 'DESC' },
  { name: 'Oldest', slug: 'asc', sortBy: 'createAt', order: 'ASC' },
];

export default function SearchToolbar() {
  const [orderBy, setOrderBy] = useQueryState('orderBy', {
    defaultValue: '',
    clearOnDefault: true,
  });

  const selectedOption
    = sortOptions.find(option => option.slug === orderBy) || null;

  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className="group inline-flex items-center justify-center text-sm font-medium
                 text-gray-700 hover:text-gray-900
                 dark:text-gray-200 dark:hover:text-gray-100"
        >
          <div>
            <Button
              variant="outline"
              className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              {selectedOption ? selectedOption.name : 'Sort'}
              <Icons.chevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className={cn(
            'z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 transition focus:outline-hidden',
            'dark:bg-gray-900 dark:ring-white/10',
          )}
        >
          <DropdownMenuGroup className="py-1">
            {sortOptions.map(option => (
              <DropdownMenuItem
                key={option.slug}
                className={cn(
                  orderBy === option.slug
                    ? 'font-medium text-gray-900 dark:text-gray-100'
                    : 'text-gray-500 dark:text-gray-400',
                  'block px-4 py-2 text-sm data-focus:bg-gray-100 dark:data-focus:bg-gray-800 data-focus:outline-hidden',
                )}
                onClick={() => setOrderBy(option.slug)}
              >
                {option.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <button
        type="button"
        className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7
               dark:text-gray-400 dark:hover:text-gray-300"
      >
        <span className="sr-only">View grid</span>
        <Icons.grid2x2 aria-hidden="true" className="size-5" />
      </button>

      <FacetsMobile />
    </div>

  );
}
