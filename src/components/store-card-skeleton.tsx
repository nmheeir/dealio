import { Card, CardContent, CardHeader } from './ui/card';
import { Skeleton } from './ui/skeleton';

export function StoreCardSkeleton() {
  return (
    <Card className="relative h-full rounded-lg">
      <Skeleton className="absolute top-4 right-4 h-4 w-20 rounded-sm px-2 py-0.5" />
      <CardHeader>
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-4 pt-4">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/3" />
      </CardContent>
    </Card>
  );
}
