/* eslint-disable react/no-array-index-key */
'use client';

import { useCategories } from '@/api/category/use-categories';
import { cn } from '@/libs/utils';
import { AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';

type CategoryFacetProps = {
  id: string;
  className?: string;
  isCheckedAction: (value: string) => boolean;
  onCheckedChangeAction: (value: string) => void;
};

export default function CategoryFacet({ id, className, onCheckedChangeAction, isCheckedAction }: CategoryFacetProps) {
  return (
    <AccordionItem
      value={id}
      className={cn(
        className,
      )}
    >
      <AccordionTrigger className="hover:no-underline">
        <p className="font-sans tracking-wide uppercase">Category</p>
      </AccordionTrigger>
      <CategoryFacetContent onCheckedChangeAction={onCheckedChangeAction} isCheckedAction={isCheckedAction} />
    </AccordionItem>
  );
}

function CategoryFacetContent({ onCheckedChangeAction, isCheckedAction }: Omit<CategoryFacetProps, 'id'>) {
  const { data, isLoading, error } = useCategories();

  if (isLoading) {
    return (
      <AccordionContent className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-6 w-20 animate-pulse rounded-md bg-gray-200"
          />
        ))}
      </AccordionContent>
    );
  }

  if (error || !data) {
    return <p className="text-sm text-red-500">Error...</p>;
  }

  const categories = data.data;

  return (
    <AccordionContent className="flex flex-wrap gap-2">
      {categories.map(category => (
        <Badge
          key={category.id}
          variant="animated"
          selected={isCheckedAction(category.slug)}
          onClick={() => onCheckedChangeAction(category.slug)}
        >
          <span className="relative z-10">{category.name}</span>
        </Badge>
      ))}
    </AccordionContent>
  );
}
