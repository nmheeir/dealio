import React from 'react';

export default function LobbyPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Lobby</h1>

      {/* Chỉ bọc từng phần cần async */}
      {/* <React.Suspense fallback={<LobbySkeleton />}>
        <Products />
      </React.Suspense>

      <React.Suspense fallback={<CategorySkeleton />}>
        <Categories />
      </React.Suspense>

      <React.Suspense fallback={<StoreSkeleton />}>
        <Stores />
      </React.Suspense> */}
    </div>
  );
}
