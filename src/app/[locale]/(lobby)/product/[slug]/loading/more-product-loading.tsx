/* eslint-disable react/no-array-index-key */
import { ProductCardSkeleton } from '@/components/product-card-skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

export default function MoreProductLoading() {
  return (
    <div className="space-y-6 overflow-hidden">
      <Skeleton className="h-7 w-1/4" />
      <ScrollArea orientation="horizontal" className="pb-3.5">
        <div className="flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} className="min-w-[260px]" />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
