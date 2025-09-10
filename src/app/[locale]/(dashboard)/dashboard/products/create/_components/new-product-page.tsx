'use client';

import React from 'react';
import { toast } from 'sonner';
import { useBrands } from '@/api/brand/use-brand';
import { useCategories } from '@/api/category/use-categories';
import { NewProductForm } from './new-product-form';
import { NewProductSkeleton } from './new-product-skeleton';

export function NewProductPage() {
  const {
    data: brandResponse,
    isLoading: isBrandsLoading,
    error: brandError,
  } = useBrands();

  const {
    data: categoryResponse,
    isLoading: isCategoriesLoading,
    error: categoryError,
  } = useCategories();

  if (isBrandsLoading || isCategoriesLoading) {
    return <NewProductSkeleton />;
  }

  if (brandError || categoryError) {
    toast.error('Cannot load brand and category data');
  }

  return (
    <NewProductForm
      brands={brandResponse?.data.data ?? []}
      categories={categoryResponse?.data.data ?? []}
    />
  );
}
