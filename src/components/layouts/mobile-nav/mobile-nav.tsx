'use client';

import { MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import React from 'react';

import { Icons } from '@/components/icons';
import { Accordion } from '@/components/ui/accordion';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { siteConfig } from '@/config/site';
import { useMediaQuery } from '@/hooks/use-media-query';
import { MobileBrandsNavItem } from './mobile-brands-nav-item';
import { MobileCategoriesNavItem } from './mobile-categories-nav-item';
import { MobileHomeNavItem } from './mobile-home-nav-item';

export function MobileNav() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const segment = useSelectedLayoutSegment();
  const [open, setOpen] = React.useState(false);

  if (isDesktop) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-5 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
        >
          <MenuIcon aria-hidden="true" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pt-9 pr-0 pl-1">
        {/* Logo */}
        <div className="w-full px-7">
          <Link
            href="/"
            className="flex items-center"
            onClick={() => setOpen(false)}
          >
            <Icons.gitHub className="mr-2 size-4" aria-hidden="true" />
            <span className="font-bold">{siteConfig.name}</span>
            <span className="sr-only">Home</span>
          </Link>
        </div>

        {/* Scroll content */}
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="pr-7 pl-1">
            <Accordion type="multiple" className="w-full">
              <MobileHomeNavItem setOpenAction={setOpen} segment={String(segment)} />
              <MobileCategoriesNavItem setOpenAction={setOpen} segment={String(segment)} />
              <MobileBrandsNavItem setOpenAction={setOpen} segment={String(segment)} />
            </Accordion>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
