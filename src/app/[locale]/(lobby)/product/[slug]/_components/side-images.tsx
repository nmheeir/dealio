import type { Dispatch, SetStateAction } from 'react';
import type { ProductImage } from '@/api/products/types';
import type { CarouselApi } from '@/components/ui/carousel';
import Image from 'next/image';
import React from 'react';
import { Carousel, CarouselContent } from '@/components/ui/carousel';
import { cn } from '@/libs/utils';

type SideImagesProps = {
  images: ProductImage[];
  api: CarouselApi;
  setThumbsApi: Dispatch<SetStateAction<CarouselApi>>;
  current: number;
  className?: string;
};

export function SideImages(
  { className, images, api, setThumbsApi, current }: SideImagesProps,
) {
  const onThumbClick = React.useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api],
  );

  return (
    <div className={className}>
      <Carousel
        className="my-4 md:sticky md:top-[100px]"
        orientation="vertical"
        setApi={setThumbsApi}
        opts={{ skipSnaps: true, watchDrag: false }}
      >
        <CarouselContent className="mt-0 w-full flex-row justify-center gap-4 md:flex-col">
          {images.map((image, index) => (
            <div
              className={cn('overflow-hidden rounded-md', index === current && 'border-2 border-black')}
              key={`thumbnail_${image.id || index}`}
              onMouseEnter={() => onThumbClick(index)}
            >
              <Image
                alt={image.id || `Product image ${index + 1}`}
                src={image.product_url || `/default-product-image.svg`}
                width={120}
                height={120}
                sizes="120px"
                className="object-cover"
              />
            </div>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
