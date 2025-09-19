'use client';

import Link from 'next/link';
import { NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { cn } from '@/libs/utils';

export function HomeNavItem() {
  return (
    <NavigationMenuItem>
      <Link href="/" passHref>
        <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), 'h-auto')}>
          Home
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );
}
