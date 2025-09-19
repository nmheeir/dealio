'use client';

import { useCategoryNotChild } from '@/api/category/use-category-not-child';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MobileLink } from './mobile-link';

export function MobileCategoriesNavItem({
  setOpenAction: setOpen,
  segment,
}: { setOpenAction: React.Dispatch<React.SetStateAction<boolean>>; segment: string }) {
  const { data, isLoading, error } = useCategoryNotChild();

  return (
    <AccordionItem value="categories">
      <AccordionTrigger className="text-sm capitalize">Categories</AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col space-y-2">
          {isLoading && Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 w-24 animate-pulse rounded bg-muted" />
          ))}
          {error && <span className="text-sm text-red-500">Error...</span>}
          {data?.data.data?.map((cat: any) => (
            <MobileLink
              key={cat.id}
              href={`/category/${cat.slug}`}
              segment={segment}
              setOpen={setOpen}
              className="m-1"
            >
              {cat.name}
            </MobileLink>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
