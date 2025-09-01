import { Skeleton } from '@/components/ui/skeleton';

export default function SearchPaginationLoading() {
  return (
    <div className="mt-8 flex justify-center">
      <div className="flex items-center space-x-2">
        {/* Previous button */}
        <Skeleton className="h-9 w-16 rounded" />

        {/* Page numbers skeleton */}
        <Skeleton className="h-9 w-9 rounded" />
        <Skeleton className="h-9 w-9 rounded" />
        <Skeleton className="h-9 w-9 rounded" />
        <Skeleton className="h-9 w-9 rounded" />

        {/* Ellipsis skeleton */}
        <Skeleton className="h-9 w-6 rounded" />

        {/* Last page skeleton */}
        <Skeleton className="h-9 w-9 rounded" />

        {/* Next button */}
        <Skeleton className="h-9 w-16 rounded" />
      </div>
    </div>
  );
}
