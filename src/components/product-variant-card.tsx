import type { z } from 'zod';
import type { productVariantSchema } from '@/api/schemas/product/product-variant.schema';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type ProductVariant = z.infer<typeof productVariantSchema>;

type ProductVariantCardProps = {
  variant: ProductVariant;
};

export function ProductVariantCard({ variant }: ProductVariantCardProps) {
  const mainImage
    = variant.images.find(img => img.is_main)?.product_url
      || variant.images[0]?.product_url
      || '';

  const price = Number.parseFloat(variant.price);
  const discount = Number.parseFloat(variant.discount);
  const finalPrice = discount > 0 ? price - discount : price;

  return (
    <Card className="flex h-full w-full max-w-sm flex-col border bg-white py-0 pb-6
                transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-900"
    >
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          {mainImage
            ? (
                <Image
                  src={mainImage}
                  alt={variant.variant_name}
                  fill
                  className="rounded-t-lg object-cover"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              )
            : (
                <div className="flex h-full w-full items-center justify-center rounded-t-lg
                        bg-gray-200 dark:bg-gray-800"
                >
                  <span className="text-gray-500 dark:text-gray-400">No Image</span>
                </div>
              )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-grow flex-col p-4">
        <CardTitle className="line-clamp-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {variant.variant_name}
        </CardTitle>

        {/* Giá */}
        <div className="mt-2 text-lg font-bold text-gray-900 dark:text-gray-100">
          {discount > 0
            ? (
                <div className="flex flex-col">
                  <span className="text-red-600 dark:text-red-400">
                    $
                    {finalPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 line-through dark:text-gray-400">
                    $
                    {price.toFixed(2)}
                  </span>
                </div>
              )
            : (
                <span>
                  $
                  {price.toFixed(2)}
                </span>
              )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link href={`/product-variant/${variant.slug}`} className="w-full">
          <Button
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-100
                   dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>

  );
}
