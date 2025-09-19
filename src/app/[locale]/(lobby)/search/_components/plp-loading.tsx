/* eslint-disable react/no-array-index-key */
import { ProductCardSkeleton } from '@/components/product-card-skeleton';
import SearchPaginationLoading from '@/components/search/search-pagination-loading';

export default function PLPLoading() {
  return (
    <div className="flex grow flex-col lg:col-span-3">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Your content Product Display */}
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
      {/* Paging placeholder */}
      <SearchPaginationLoading />
    </div>
  );
}
