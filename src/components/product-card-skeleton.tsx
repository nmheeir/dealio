import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProductCardSkeleton() {
  return (
    <Card className="mx-auto flex h-full w-full max-w-sm flex-col py-0 pb-6">
      <CardHeader className="p-0">
        <Skeleton className="h-48 w-full rounded-t-lg" />
      </CardHeader>
      <CardContent className="flex flex-grow flex-col px-4">
        <Skeleton className="mt-2 h-5 w-3/4" />
        {' '}
        {/* title */}
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-5/6" />
        <Skeleton className="mt-4 h-6 w-24" />
        {' '}
        {/* badge */}
        <Skeleton className="mt-4 h-6 w-20" />
        {' '}
        {/* price */}
      </CardContent>
      <CardFooter className="pt-0">
        <Skeleton className="h-10 w-full rounded-md" />
        {' '}
        {/* button */}
      </CardFooter>
    </Card>
  );
}
