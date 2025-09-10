import React from 'react';
import { useProductDetail } from '@/api/products/use-detail-product';
import { Skeleton } from '@/components/ui/skeleton';
import ProductInfoCard from './product-info-card';
import { VariantList } from './variant-list';

export default function ProductDetailSection({ slug }: { slug: string }) {
  const { data, isLoading, error } = useProductDetail({ variables: {
    id: slug,
  } });

  if (isLoading) {
    return <ProductDetailSectionLoading />;
  }

  if (error || data?.statusCode === 404) {
    return <span>{error?.message}</span>;
  }

  if (!data) {
    return <span>not data</span>;
  }

  const product = data.data;

  return (
    <div className="w-full">
      <ProductInfoCard product={product} />
      <VariantList productId={product.id} />
    </div>
  );
}

function ProductDetailSectionLoading() {
  return (
    <div className="w-full space-y-6">
      {/* ProductInfoCard skeleton */}
      <div className="space-y-4 rounded-lg border p-6">
        <Skeleton className="h-6 w-1/3" />
        {' '}
        {/* Tên sản phẩm */}
        <Skeleton className="h-4 w-1/4" />
        {' '}
        {/* SKU */}
        <Skeleton className="h-4 w-1/2" />
        {' '}
        {/* Mô tả */}
        <div className="flex gap-4">
          <Skeleton className="h-10 w-24" />
          {' '}
          {/* Button */}
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* VariantList skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          {' '}
          {/* Tiêu đề */}
          <Skeleton className="h-9 w-40" />
          {' '}
          {/* Select filter */}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="space-y-3 rounded-lg border p-4"
            >
              <Skeleton className="h-5 w-2/3" />
              {' '}
              {/* Tên variant */}
              <Skeleton className="h-4 w-1/2" />
              {' '}
              {/* SKU */}
              <Skeleton className="h-4 w-1/3" />
              {' '}
              {/* Giá */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
