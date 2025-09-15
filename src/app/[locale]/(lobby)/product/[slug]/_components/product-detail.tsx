/* eslint-disable no-console */
'use client';

import type { ProductVariant } from '@/api/schemas/product/product-variant.schema';

import { useQueryClient } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import { useQueryState } from 'nuqs';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAddVariantToCart } from '@/api/cart/use-add-variant';
import { useFindVariantsByProductSlug } from '@/api/product-variant/use-find-variant-by-product-slug';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icons } from '@/components/icons';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ProductDetailLoading from '../loading/product-detail-loading';
import { ProductDetailImages } from './product-images';
import ProductTitle from './product-title';

type ProductDetailProps = {
  slug: string;
};

function getAvailableStock(variant: ProductVariant): number {
  if (!variant.stock) {
    return 0;
  }
  return Math.max(0, variant.stock.quantity - variant.stock.reserved);
}

export default function ProductDetailSection({ slug }: ProductDetailProps) {
  const { data, isLoading, error } = useFindVariantsByProductSlug({ variables: { slug } });
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [_variantChoose, setVariantChoose] = useQueryState('variant', {
    defaultValue: '',
    clearOnDefault: true,
    shallow: true,
    history: 'push',
  });
  const [quantity, setQuantity] = useState(1);
  const { mutateAsync: addToCart } = useAddVariantToCart();
  const queryClient = useQueryClient();

  // Initialize selected variant based on slug
  useEffect(() => {
    if (data?.data) {
      const variant = data.data.find((p: ProductVariant) => p.slug === slug);
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setSelectedVariant(variant ?? data.data[0] ?? null);
    }
  }, [data, slug]);

  if (isLoading) {
    return <ProductDetailLoading />;
  }

  if (error || !data || !data.data || data.data.length === 0) {
    return notFound();
  }

  const productVariants = data.data;
  const variant = selectedVariant || productVariants[0];

  const maxStock = variant ? getAvailableStock(variant) : 0;

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setVariantChoose(variant.slug);
  };

  const handleDecrease = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity(prev => Math.min(maxStock, prev + 1));
  };

  const handleAddToCart = async () => {
    console.log(`Add ${quantity} sản phẩm ${variant?.variant_name} vào giỏ hàng`);
    // TODO: gọi API hoặc context cart ở đây
    if (!variant) {
      toast.error('Please select one variant');
      return;
    }
    if (quantity <= 0) {
      toast.error('Số lượng phải lớn hơn 0.');
      return;
    }

    addToCart(
      {
        productVariantId: variant.id,
        quantity,
      },
      {
        onSuccess: (data) => {
          toast.success(`Đã thêm ${quantity} sản phẩm "${variant.variant_name}" vào giỏ hàng`);
          console.log('API response:', data);
          queryClient.invalidateQueries({ queryKey: ['carts'] });
        },
        onError: (error) => {
          const message
            = (error.response?.data as any)?.message || 'Không thể thêm sản phẩm vào giỏ hàng';
          toast.error(message);
          console.error('API error:', error);
        },
      },
    );
  };

  if (!variant) {
    return <span>No data</span>;
  }

  return (
    <main className="mx-auto space-y-2 px-4 pb-8 lg:px-16">
      {/* Breadcrumb */}
      <div className="relative flex w-full items-center justify-center gap-10 py-4 md:pt-12">
        <div className="mx-auto w-full max-w-[1024px]">
          {variant && <Breadcrumbs items={makeBreadcrumbs(variant)} />}
        </div>
      </div>

      {/* Product Detail */}
      <div className="grid grid-cols-1 gap-4 pt-4 md:mx-auto md:max-w-screen-xl md:grid-cols-12 md:gap-8">
        <ProductTitle
          className="md:hidden"
          title={variant.variant_name}
          price={variant.price}
          currency="$"
        />
        <ProductDetailImages images={variant.images} />
        <div className="space-y-4 md:col-span-6 md:col-start-8 md:mt-0">
          <ProductTitle
            className="hidden md:col-span-4 md:col-start-9 md:block"
            title={variant.variant_name}
            price={variant.price}
            currency="$"
          />

          {/* Variant Selection */}
          <div className="space-y-2">
            <h3 className="font-semibold">Chọn biến thể:</h3>
            <div className="flex flex-wrap gap-2">
              {productVariants.map((v) => {
                const stockQuantity = v.stock?.quantity ?? 0; // fallback mặc định
                return (
                  <Button
                    key={v.id}
                    variant={v.id === variant.id ? 'default' : 'outline'}
                    className="text-sm"
                    onClick={() => handleVariantChange(v)}
                    disabled={stockQuantity === 0}
                  >
                    {v.variant_name}
                  </Button>
                );
              })}
            </div>
            {(getAvailableStock(variant) ?? 0) === 0 && (
              <p className="text-sm text-red-500">Hết hàng</p>
            )}
          </div>

          {/* Quantity Selector and Add to Cart */}
          <div className="flex items-center gap-3 py-8">
            <div className="flex items-center justify-between rounded-lg border bg-background">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-l-lg"
                onClick={handleDecrease}
                disabled={(getAvailableStock(variant) ?? 0) <= 1}
                aria-label="Giảm số lượng"
              >
                <Icons.minus className="h-4 w-4" />
              </Button>
              <div className="flex h-10 w-20 items-center justify-center rounded-lg border">
                <input
                  type="number"
                  min={1}
                  max={maxStock}
                  value={quantity}
                  onChange={(e) => {
                    let val = Number(e.target.value);
                    if (Number.isNaN(val) || val < 1) {
                      val = 1;
                    }
                    if (val > maxStock) {
                      val = maxStock;
                    }
                    setQuantity(val);
                  }}
                  className="w-full [appearance:textfield] text-center text-sm font-medium
                            focus:outline-none
                            [&::-webkit-inner-spin-button]:appearance-none
                            [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-r-lg"
                onClick={handleIncrease}
                disabled={(getAvailableStock(variant) ?? 0) === 0}
                aria-label="Tăng số lượng"
              >
                <Icons.plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              className="rounded-full bg-green-500 px-6 py-3 font-medium text-white hover:bg-green-600"
              aria-label={`Thêm ${(getAvailableStock(variant) ?? 0)} sản phẩm vào giỏ hàng`}
              disabled={(getAvailableStock(variant) ?? 0) === 0}
              onClick={handleAddToCart}
            >
              <Icons.shoppingCart className="mr-2 h-4 w-4" />
              Thêm vào giỏ hàng
            </Button>
          </div>

          <Separator className="my-4" />

          {/* Description */}
          <p className="py-4">{variant.product.description}</p>

          {/* Specifications */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="specs">
              <AccordionTrigger className="font-serif tracking-widest hover:no-underline">THÔNG SỐ KỸ THUẬT</AccordionTrigger>
              <AccordionContent className="mt-8">
                <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                  {Object.entries(variant.other_attributes).map(([key, value]) => (
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

function makeBreadcrumbs(variant: ProductVariant) {
  return [
    { name: 'Home', href: '/' },
    { name: variant.product.name, href: `/product/${variant.product.slug}` },
    { name: variant.variant_name, href: '' }, // đang ở trang variant
  ];
}
