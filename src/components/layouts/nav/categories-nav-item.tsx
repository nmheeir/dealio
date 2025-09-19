'use client';

import Link from 'next/link';
import { useCategoryNotChild } from '@/api/category/use-category-not-child';
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

import { cn } from '@/libs/utils';

export function CategoriesNavItem() {
  const { data, isLoading, error } = useCategoryNotChild();

  if (isLoading) {
    return (
      <NavigationMenuItem>
        <NavigationMenuTrigger className="h-auto capitalize">Categories</NavigationMenuTrigger>
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
          <div className="p-4 text-sm text-red-500">Error loading categories</div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }
  const categories = data?.data.data ?? [];

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="h-auto capitalize">Categories</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
          { categories.map(cat => (
            <li key={cat.id}>
              <NavigationMenuLink asChild>
                <Link
                  href={`/category/${cat.slug}`}
                  className={cn(
                    'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground',
                  )}
                >
                  <div className="text-sm leading-none font-medium">{cat.name}</div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    {cat.description}
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
