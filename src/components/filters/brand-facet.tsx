/* eslint-disable react/no-array-index-key */
'use client';

import { useBrands } from '@/api/brand/use-brand';
import { cn } from '@/libs/utils';
import { AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';

type BrandFacetProps = {
  id: string;
  className?: string;
  isCheckedAction: (value: string) => boolean;
  onCheckedChangeAction: (value: string) => void;
};

export function BrandFacet({ id, className, onCheckedChangeAction, isCheckedAction }: BrandFacetProps) {
  return (
    <AccordionItem
      className={cn(
        className,
      )}
      value={id}
    >
      <AccordionTrigger className="hover:no-underline">
        <p className="font-sans tracking-wide uppercase">Brand</p>
      </AccordionTrigger>
      <BrandFacetContent onCheckedChangeAction={onCheckedChangeAction} isCheckedAction={isCheckedAction} />
    </AccordionItem>
  );
}

function BrandFacetContent({ onCheckedChangeAction, isCheckedAction }: Omit<BrandFacetProps, 'id'>) {
  const { data, isLoading, error } = useBrands();

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

  return (
    <AccordionContent className="flex flex-wrap gap-2">
      {data.data.map(brand => (
        <Badge
          key={brand.id}
          variant="outline"
          onClick={() => onCheckedChangeAction(brand.slug)}
          className={cn(
            'relative overflow-hidden rounded-full cursor-pointer font-medium transition-colors',
            'before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-500 before:to-purple-500 before:transition-transform before:duration-500 before:z-0',
            isCheckedAction(brand.slug)
              ? 'before:translate-x-0 text-white font-semibold'
              : 'before:-translate-x-full text-gray-800 hover:before:translate-x-0 hover:text-white',
          )}
        >
          <span className="relative z-10">{brand.name}</span>
        </Badge>

      ))}
    </AccordionContent>
  );
}
