import type { Metadata } from 'next';
import type { SearchParams } from '@/types';
import { AlertCard } from '@/components/alert-card';

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from '@/components/page-header';
import { Shell } from '@/components/shell';
import { Env } from '@/libs/Env';
import { getProducts } from '@/libs/queries/product';
import { toTitleCase } from '@/libs/utils';

type CategoryPageProps = {
  params: {
    category: string;
  };
  searchParams: SearchParams;
};

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  return {
    metadataBase: new URL(Env.NEXT_PUBLIC_APP_URL),
    title: toTitleCase(params.category),
    description: `Buy products from the ${params.category} category`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const category = decodeURIComponent(params.category);

  // eslint-disable-next-line unused-imports/no-unused-vars
  const productsTransaction = await getProducts(searchParams);

  return (
    <Shell>
      <PageHeader>
        <PageHeaderHeading size="sm">{toTitleCase(category)}</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          {`Buy ${category} from the best stores`}
        </PageHeaderDescription>
      </PageHeader>
      <AlertCard />
    </Shell>
  );
}
