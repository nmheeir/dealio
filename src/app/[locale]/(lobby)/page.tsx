import React from 'react';
import { LobbySkeleton } from './_components/lobby-skeleton';

export default function LobbyPage() {
  return (
    <React.Suspense fallback={<LobbySkeleton />}>
      {/* <Lobby
        productsPromise={productsPromise}
        categoriesPromise={categoriesPromise}
        storesPromise={storesPromise}
      /> */}
      Lobby
    </React.Suspense>
  );
}
