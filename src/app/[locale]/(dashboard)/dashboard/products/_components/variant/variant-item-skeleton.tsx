import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function VariantItemSkeleton() {
  return (
    <Card className="w-full space-y-0.5">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col space-y-2">
          {/* Tiêu đề */}
          <CardTitle className="flex items-center space-x-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-12" />
          </CardTitle>

          {/* Badge giả */}
          <div className="mt-1 flex gap-2">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button size="icon" variant="ghost" disabled>
            <Skeleton className="size-4 rounded" />
          </Button>
          <Button size="icon" variant="ghost" disabled>
            <Skeleton className="size-4 rounded" />
          </Button>
        </div>
      </CardHeader>

      {/* Nội dung */}
      <CardContent className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
        {/* Bên trái: Image giả */}
        <div className="flex justify-center md:justify-start">
          <Skeleton className="size-32 rounded-sm" />
        </div>

        {/* Bên phải: 3 hàng giả */}
        <div className="flex w-full flex-col gap-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-14" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
