/* eslint-disable react/no-array-index-key */
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/libs/utils';

export default function MoreProductLoading() {
  return (
    <div className="space-y-6 overflow-hidden pt-4">
      <h2
        className={cn(
          'line-clamp-1 flex-1 px-4 text-2xl font-bold',
          'px-4 lg:px-8',
        )}
      >
        Similar product
      </h2>

      <ScrollArea orientation="horizontal" className="pb-3.5">
        <div className={cn('flex gap-4 px-4', 'px-4 lg:px-8')}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="min-w-[260px] space-y-3 rounded-md border p-3"
            >
              {/* Image skeleton */}
              <Skeleton className="h-40 w-full rounded-md" />

              {/* Text skeleton */}
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
