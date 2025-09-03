/* eslint-disable react/no-array-index-key */
'use client';

import { useCategories } from '@/api/category/use-categories';
import { CategoryCard } from './category-card';
import { CategoryCardSkeleton } from './category-card-skeleton';

export default function LobbyCategorySection() {
  const { data, isLoading, error } = useCategories();

  if (isLoading) {
    return (
      <section className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CategoryCardSkeleton key={i} />
        ))}
      </section>
    );
  }

  if (error || !data) {
    return (
      <span>
        No data
        {error?.message}
      </span>
    );
  }

  const categories = data.data.data;

  return (
    <section
      className="grid animate-fade-up grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-4"
      style={{ animationDelay: '0.50s', animationFillMode: 'both' }}
    >
      {categories.map(category => (
        <CategoryCard key={category.name} category={category} />
      ))}
    </section>
  );
}
