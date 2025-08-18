import { cn } from '@/libs/utils';
import { Icons } from './icons';

type RatingProps = {
  rating: number;
};

export function Rating({ rating }: RatingProps) {
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icons.star
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          className={cn(
            'size-4',
            rating >= i + 1 ? 'text-yellow-500' : 'text-muted-foreground',
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
