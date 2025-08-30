'use client';

import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import * as React from 'react';

import { cn } from '@/libs/utils';

const ScrollBar = ({ ref, className, orientation = 'vertical', ...props }: React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> & { ref?: React.RefObject<React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> | null> }) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      'flex touch-none select-none transition-colors',
      orientation === 'vertical'
      && 'h-full w-2.5 border-l border-l-transparent p-px',
      orientation === 'horizontal'
      && 'h-2.5 border-t border-t-transparent p-px',
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
);
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

const ScrollArea = ({ ref, className, children, orientation, scrollBarClassName, ...props }: React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
  orientation?: 'vertical' | 'horizontal';
  scrollBarClassName?: string;
} & { ref?: React.RefObject<React.ElementRef<typeof ScrollAreaPrimitive.Root> | null> }) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn('relative overflow-hidden', className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="size-full rounded-[inherit] px-0">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar orientation={orientation} className={cn(scrollBarClassName)} />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
);
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

export { ScrollArea, ScrollBar };
