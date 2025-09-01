/* eslint-disable react/no-array-index-key */
import { Skeleton } from '@/components/ui/skeleton';

export default function SearchViewLoading() {
  return (
    <div>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pt-6 pb-6">
          <Skeleton className="h-10 w-40 rounded" />
          {' '}
          {/* fake title */}
          <Skeleton className="h-10 w-32 rounded" />
          {' '}
          {/* fake search toolbar */}
        </div>

        {/* Content */}
        <section aria-labelledby="products-heading" className="pt-6 pb-24">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            {/* Filters (sidebar) */}
            <div className="hidden space-y-4 lg:block">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-32 rounded" />
              ))}
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:col-span-3 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-48 w-full rounded-md" />
                  {' '}
                  {/* product image */}
                  <Skeleton className="h-4 w-3/4 rounded" />
                  {' '}
                  {/* product name */}
                  <Skeleton className="h-4 w-1/2 rounded" />
                  {' '}
                  {/* product price */}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
