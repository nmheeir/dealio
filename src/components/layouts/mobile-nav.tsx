/* eslint-disable react/no-array-index-key */
'use client';

import type { MainNavItem } from '@/types';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import React from 'react';
import { siteConfig } from '@/config/site';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/libs/utils';
import { Icons } from '../icons';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

type MobileNavProps = {
  items: MainNavItem[];
};

type MobileLinkProps = {
  href: string;
  disabled?: boolean;
  segment: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

function MobileLink({
  children,
  href,
  disabled,
  segment,
  setOpen,
  className,
  ...props
}: MobileLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'text-foreground/70 transition-colors hover:text-foreground',
        href.includes(segment) && 'text-foreground',
        disabled && 'pointer-events-none opacity-60',
        className,
      )}
      onClick={() => setOpen(false)}
      {...props}
    >
      {children}
    </Link>
  );
}

export function MobileNav({ items }: MobileNavProps) {
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
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="pr-7 pl-1">
            <Accordion type="multiple" className="w-full">
              {items?.map((item, index) => (
                <AccordionItem value={item.title} key={index}>
                  <AccordionTrigger className="text-sm capitalize">
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col space-y-2">
                      {item.items?.map((subItem, index) =>
                        subItem.href
                          ? (
                              <MobileLink
                                key={index}
                                href={String(subItem.href)}
                                segment={String(segment)}
                                setOpen={setOpen}
                                disabled={subItem.disabled}
                                className="m-1"
                              >
                                {subItem.title}
                              </MobileLink>
                            )
                          : (
                              <div
                                key={index}
                                className="text-foreground/70 transition-colors"
                              >
                                {item.title}
                              </div>
                            ),
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
