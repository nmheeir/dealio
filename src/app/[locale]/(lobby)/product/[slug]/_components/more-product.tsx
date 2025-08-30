import { ProductCard } from '@/components/product-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/libs/utils';

// TODO: fetch similar product from brand

export default function MoreProductSection() {
  const store = {
    id: 'store-1',
    name: 'Nike Official Store',
  };

  const otherProducts = [
    {
      id: '2',
      name: 'Nike Air Force 1',
      price: 149.99,
      description: 'Iconic basketball shoe, reimagined.',
      rating: 4.2,
      inventory: 5,
      images: [{ id: '2', name: 'AF1', url: '/images/shoe-4.jpg' }],
    },
    {
      id: '3',
      name: 'Nike Jordan Retro',
      price: 249.99,
      description: 'Legendary style with premium build.',
      rating: 4.8,
      inventory: 3,
      images: [{ id: '3', name: 'Jordan', url: '/images/shoe-5.jpg' }],
    },
  ];

  if (!store || otherProducts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6 overflow-hidden pt-4">
      <h2
        className={cn(
          'line-clamp-1 flex-1 px-4 text-2xl font-bold',
          'px-4 lg:px-8',
        )}
      >
        More products from
        {' '}
        {store.name}
      </h2>

      <ScrollArea orientation="horizontal" className="pb-3.5">
        <div className={cn('flex gap-4 px-4', 'px-4 lg:px-8')}>
          {otherProducts.map(p => (
            <ProductCard key={p.id} product={p} className="min-w-[260px]" />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
