/* eslint-disable react/no-array-index-key */
/* eslint-disable tailwindcss/no-custom-classname */
import Link from 'next/link';
import { ContentSection } from '@/components/content-section';
import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header';
import { ProductCardSkeleton } from '@/components/product-card-skeleton';
import { Shell } from '@/components/shell';
import { StoreCardSkeleton } from '@/components/store-card-skeleton';
import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/libs/utils';
import { CategoryCardSkeleton } from './category-card-skeleton';

export function LobbySkeleton() {
  return (
    <Shell className="max-w-6xl gap-0">
      <PageHeader
        as="section"
        className="mx-auto items-center gap-2 text-center"
        withPadding
      >
        <Skeleton className="h-7 w-44 rounded-full" />
        <PageHeaderHeading
          className="animate-fade-up"
          style={{ animationDelay: '0.20s', animationFillMode: 'both' }}
        >
          Foundation for your commerce platform
        </PageHeaderHeading>
        <PageHeaderDescription
          className="animate-fade-up max-w-[46.875rem]"
          style={{ animationDelay: '0.30s', animationFillMode: 'both' }}
        >
          Skateshop is an open-source platform for building and customizing your
          own commerce platform with ease.
        </PageHeaderDescription>
        <PageActions
          className="animate-fade-up"
          style={{ animationDelay: '0.40s', animationFillMode: 'both' }}
        >
          <Link href="/products" className={cn(buttonVariants())}>
            Buy now
          </Link>
          <Link
            href="/dashboard/stores"
            className={cn(buttonVariants({ variant: 'outline' }))}
          >
            Sell now
          </Link>
        </PageActions>
      </PageHeader>
      <section className="xs:grid-cols-2 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CategoryCardSkeleton key={i} />
        ))}
      </section>
      <ContentSection
        title="Featured products"
        description="Explore products from around the world"
        href="/products"
        linkText="View all products"
        className="pt-14 md:pt-20 lg:pt-24"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </ContentSection>
      <ContentSection
        title="Featured stores"
        description="Explore stores from around the world"
        href="/stores"
        linkText="View all stores"
        className="py-14 md:py-20 lg:py-24"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <StoreCardSkeleton key={i} />
        ))}
      </ContentSection>
    </Shell>
  );
}
