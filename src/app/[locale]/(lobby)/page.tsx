import React from 'react';
import { getCategories, getFeaturedProducts } from '@/libs/queries/product';
import { getFeaturedStores } from '@/libs/queries/store';
import { Lobby } from './_components/lobby';
import { LobbySkeleton } from './_components/lobby-skeleton';

export default function LobbyPage() {
  const productsPromise = getFeaturedProducts();
  const categoriesPromise = getCategories();
  const storesPromise = getFeaturedStores();

  return (
    <React.Suspense fallback={<LobbySkeleton />}>
      <Lobby
        productsPromise={productsPromise}
        categoriesPromise={categoriesPromise}
        storesPromise={storesPromise}
      />
    </React.Suspense>
  );
}
