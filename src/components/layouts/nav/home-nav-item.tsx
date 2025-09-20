'use client';

import Link from 'next/link';
import { NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { cn } from '@/libs/utils';

export function HomeNavItem() {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), 'h-auto')}>
        <Link href="/">Home</Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}
