'use client';

import Link from 'next/link';
import { useBrands } from '@/api/brand/use-brand';

import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/libs/utils';

export function BrandsNavItem() {
  const { data, isLoading, error } = useBrands(
    { variables: {
      limit: 10,
    } },
  );

  if (isLoading) {
    return (
      <NavigationMenuItem>
        <NavigationMenuTrigger className="h-auto capitalize">Brands</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
            {Array.from({ length: 4 }).map((_, i) => (
              <li
                key={i}
                className="h-16 animate-pulse rounded-md bg-muted"
              />
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  if (error) {
    return (
      <NavigationMenuItem>
        <NavigationMenuTrigger className="h-auto capitalize">Brands</NavigationMenuTrigger>
        <NavigationMenuContent>
          <div className="p-4 text-sm text-red-500">Error loading brands</div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  const brands = data?.data.data ?? [];

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="h-auto capitalize">Brands</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
          {brands.map((brand: any) => (
            <li key={brand.id}>
              <NavigationMenuLink asChild>
                <Link
                  href={`/search?brand=${brand.slug}`}
                  className={cn(
                    'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground',
                  )}
                >
                  <div className="text-sm leading-none font-medium">{brand.name}</div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    {brand.description}
                  </p>
                </Link>
              </NavigationMenuLink>
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
