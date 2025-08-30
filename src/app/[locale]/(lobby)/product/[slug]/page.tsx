/* eslint-disable ts/no-use-before-define */

import { client } from '@/api/common';
import { ProductCard } from '@/components/product-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { logger } from '@/libs/Logger';
import { cn } from '@/libs/utils';
import ProductDetail from './_components/product-detail';

export { generateMetadata } from './metadata';

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage(props: ProductPageProps) {
  const params = await props.params;
  const { slug } = params;

  let product;

  try {
    const response = await client.get(`/product-variants/${slug}`);
    product = response.data;
    logger.info(product);
  } catch (e) {
    console.warn(e);
  }

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

  return (
    <div className="relative mx-auto pt-4 xl:px-0">
      <ProductDetail slug={slug} />
      {/* More product */}
      {store && otherProducts.length > 0
        ? (
            <div className="space-y-6 overflow-hidden bg-blue-300 pt-4">
              <h2 className={cn(
                'line-clamp-1 flex-1 px-4 text-2xl font-bold',
                'px-4 lg:px-8',
              )}
              >
                More products from
                {' '}
                {store.name}
              </h2>
              <ScrollArea orientation="horizontal" className="pb-3.5">
                <div className={cn(
                  'flex gap-4 px-4',
                  'px-4 lg:px-8',
                )}
                >
                  {otherProducts.map(p => (
                    <ProductCard
                      key={p.id}
                      product={fakeProduct}
                      className="min-w-[260px]"
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          )
        : null}
    </div>
  );
}

const fakeProduct = {
  id: '0bee329d-b596-4d23-acfe-47c2ac2c6e8d',
  name: 'Áo thun basic nam',
  price: '199000', // chuỗi, vì decimal
  images: [
    // {
    //   id: 'file_1',
    //   url: 'https://picsum.photos/400/300?random=1',
    //   name: 'ao-thun-basic.jpg',
    //   size: 102400,
    //   type: 'image/jpeg',
    // },
  ],
  inventory: 42,
  category: 'Thời trang nam',
};
