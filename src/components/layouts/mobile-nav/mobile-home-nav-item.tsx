'use client';

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MobileLink } from './mobile-link';

export function MobileHomeNavItem({
  setOpenAction: setOpen,
  segment,
}: { setOpenAction: React.Dispatch<React.SetStateAction<boolean>>; segment: string }) {
  return (
    <AccordionItem value="home">
      <AccordionTrigger className="text-sm capitalize">Home</AccordionTrigger>
      <AccordionContent>
        <MobileLink
          href="/"
          segment={segment}
          setOpen={setOpen}
          className="m-1"
        >
          Dashboard
        </MobileLink>
      </AccordionContent>
    </AccordionItem>
  );
}
