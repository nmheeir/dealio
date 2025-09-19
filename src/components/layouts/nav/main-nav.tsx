'use client';

import { NavigationMenu, NavigationMenuList } from '@/components/ui/navigation-menu';
import WebLogo from '../logo';

import { BrandsNavItem } from './brands-nav-item';
import { CategoriesNavItem } from './categories-nav-item';
import { HomeNavItem } from './home-nav-item';

export function MainNav() {
  return (
    <div className="hidden gap-6 lg:flex">
      {/* Logo */}
      <WebLogo />

      {/* Navigation */}
      <NavigationMenu>
        <NavigationMenuList>
          <HomeNavItem />
          <CategoriesNavItem />
          <BrandsNavItem />
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
