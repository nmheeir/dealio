'use client';

import { useQueryState } from 'nuqs';
import { useSimilarProductVariants } from '@/api/product-variant/use-similar';
import { ProductVariantCard } from '@/components/product-variant-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/libs/utils';
import MoreProductLoading from '../loading/more-product-loading';

export default function MoreProductSection() {
  const [slug, _setSlug] = useQueryState('variant');
  const { data, isLoading, error } = useSimilarProductVariants({
    variables: { slug: slug ?? '' },
    enabled: !!slug,
  });

  if (isLoading) {
    return <MoreProductLoading />;
  }

  if (!data || error) {
    return null;
  }

  const similarProductVariants = data.data;

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
          {similarProductVariants.map(p => (
            <ProductVariantCard key={p.id} variant={p} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
