'use client';

import type { ProductVariant } from '@/api/product-variant/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';
import { useProductVariant } from '@/api/product-variant/use-product-variant';
import { Icons } from '@/components/icons';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ProductDetailLoading from '../loading/product-detail-loading';
import { ProductImages } from './product-images';
import ProductTitle from './product-title';

type ProductDetailProps = {
  slug: string;
};

export default function ProductDetail({ slug }: ProductDetailProps) {
  const { data, isLoading, error } = useProductVariant({
    variables: { slug },
  });

  if (isLoading) {
    return <ProductDetailLoading />;
  }

  if (error || !data) {
    return notFound();
  }
  const product = data.data;
  const breadcrumbs = makeBreadcrumbs(product);

  return (
    <main className="mx-auto space-y-2 px-4 pb-8 lg:px-16">
      {/* Breadcrumb */}
      <div className="relative flex w-full items-center justify-center gap-10 py-4 md:pt-12">
        <div className="mx-auto w-full max-w-[1024px]">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.href}>
                  <BreadcrumbItem>
                    {crumb.href
                      ? (
                          <BreadcrumbLink asChild>
                            <Link href={crumb.href}>{crumb.name}</Link>
                          </BreadcrumbLink>
                        )
                      : (
                          <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                        )}
                  </BreadcrumbItem>
                  {idx < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      {/* Product Detail */}
      <div className="grid grid-cols-1 gap-4 pt-4 md:mx-auto md:max-w-screen-xl md:grid-cols-12 md:gap-8">
        <ProductTitle
          className="md:hidden"
          title={product.variant_name}
          price="123"
          currency="$"
        />
        <ProductImages images={data.data.images} />
        <div className="space-y-4 md:col-span-6 md:col-start-8 md:mt-0">
          <ProductTitle
            className="hidden md:col-span-4 md:col-start-9 md:block"
            title={product.variant_name}
            price="123"
            currency="$"
          />
          <div className="flex items-center gap-3 py-8">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between rounded-lg border bg-background">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-l-lg"
                onClick={() => { }}
                // disabled={quantity <= 1 || !inStock}
                aria-label="Decrease quantity"
              >
                <Icons.minus className="h-4 w-4" />
              </Button>

              <div className="flex h-10 w-12 items-center justify-center border-x">
                <span className="text-sm font-medium" aria-live="polite">
                  {product.stock.quantity}
                </span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-r-lg"
                onClick={() => { }}
                // disabled={quantity >= maxQuantity || !inStock}
                aria-label="Increase quantity"
              >
                <Icons.plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              className="rounded-full bg-green-500 px-6 py-3 font-medium text-white hover:bg-green-600"
              aria-label={`Add ${product.stock.quantity} ${product.stock.quantity === 1 ? 'item' : 'items'} to cart`}
            >
              <Icons.shoppingCart className="mr-2 h-4 w-4" />
              Add to cart
            </Button>
          </div>
          <Separator className="my-4" />
          <p className="py-4">{product.product.description}</p>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="specs">
              <AccordionTrigger className="font-serif tracking-widest hover:no-underline">SPECIFICATIONS</AccordionTrigger>
              <AccordionContent className="mt-8">
                <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                  {Object.entries(product.other_attributes).map(([key, value]) => (
                    <React.Fragment key={key}>
                      <div className="font-serif font-semibold tracking-wider">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                      <div>{value}</div>
                    </React.Fragment>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </main>
  );
}

const fakeSpecs = [
  { label: 'SKU', value: 'AFIG' },
  { label: 'Weight', value: '99 oz' },
  { label: 'Condition', value: 'NEW' },
  {
    label: 'Light Requirements',
    value:
      'Place the African Fig in a spot with bright, indirect light. It can tolerate some low light but will grow best in filtered sunlight. Avoid direct sunlight, as it can scorch the leaves, causing brown spots or discoloration.',
  },
  {
    label: 'Watering',
    value:
      'Water when the top inch of soil feels dry to the touch. Ensure the soil is moist but not waterlogged. During the growing season (spring and summer), you may need to water more frequently.',
  },
];

// TODO: change second to go to search page

function makeBreadcrumbs(variant: ProductVariant) {
  return [
    { name: 'Home', href: '/' },
    { name: variant.product.name, href: `/product/${variant.product.slug}` },
    { name: variant.variant_name, href: '' }, // đang ở trang variant
  ];
}
