import type { Metadata } from 'next';

import type { SearchParams } from '@/types';
import { AlertCard } from '@/components/alert-card';
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from '@/components/page-header';
import { Shell } from '@/components/shell';
import { getProducts } from '@/libs/queries/product';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Buy products from our stores',
};

type ProductsPageProps = {
  searchParams: SearchParams;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  // eslint-disable-next-line unused-imports/no-unused-vars
  const productsTransaction = await getProducts(searchParams);

  return (
    <Shell>
      <PageHeader>
        <PageHeaderHeading size="sm">Products</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Buy products from our stores
        </PageHeaderDescription>
      </PageHeader>
      <AlertCard />
    </Shell>
  );
}
