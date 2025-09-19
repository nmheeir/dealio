'use client';

import { useBrands } from '@/api/brand/use-brand';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MobileLink } from './mobile-link';

export function MobileBrandsNavItem({
  setOpenAction: setOpen,
  segment,
}: { setOpenAction: React.Dispatch<React.SetStateAction<boolean>>; segment: string }) {
  const { data, isLoading, error } = useBrands();

  return (
    <AccordionItem value="brands">
      <AccordionTrigger className="text-sm capitalize">Brands</AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col space-y-2">
          {isLoading && Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 w-24 animate-pulse rounded bg-muted" />
          ))}
          {error && <span className="text-sm text-red-500">Error...</span>}
          {data?.data.data?.map((brand: any) => (
            <MobileLink
              key={brand.id}
              href={`/brand/${brand.slug}`}
              segment={segment}
              setOpen={setOpen}
              className="m-1"
            >
              {brand.name}
            </MobileLink>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
