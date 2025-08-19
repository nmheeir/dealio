/* eslint-disable unused-imports/no-unused-vars */
// TODO: fix eslint
import type { Metadata } from 'next';
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from '@/components/page-header';

import { Shell } from '@/components/shell';
import { Env } from '@/libs/Env';
import { getProducts } from '@/libs/queries/product';
import { getStores } from '@/libs/queries/store';
import { toTitleCase, unslugify } from '@/libs/utils';
import { productsSearchParamsSchema } from '@/libs/validations/params';

type SubcategoryPageProps = {
  params: {
    category: string;
    subcategory: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export function generateMetadata({ params }: SubcategoryPageProps): Metadata {
  const subcategory = unslugify(params.subcategory);

  return {
    metadataBase: new URL(Env.NEXT_PUBLIC_APP_URL),
    title: toTitleCase(subcategory),
    description: `Buy the best ${subcategory}`,
  };
}

export default async function SubcategoryPage({
  params,
  searchParams,
}: SubcategoryPageProps) {
  const { category, subcategory } = params;
  const { page, per_page, sort, price_range, store_ids, store_page, active }
    = productsSearchParamsSchema.parse(searchParams);

  // Products transaction
  const limit = typeof per_page === 'string' ? Number.parseInt(per_page) : 8;
  const offset = typeof page === 'string' ? (Number.parseInt(page) - 1) * limit : 0;

  const productsTransaction = await getProducts(searchParams);

  // Stores transaction
  const storesLimit = 25;
  const storesOffset
    = typeof store_page === 'string'
      ? (Number.parseInt(store_page) - 1) * storesLimit
      : 0;

  const storesTransaction = await getStores(searchParams);

  return (
    <Shell>
      <PageHeader>
        <PageHeaderHeading size="sm">
          {toTitleCase(unslugify(subcategory))}
        </PageHeaderHeading>
        <PageHeaderDescription size="sm">
          {`Buy the best ${unslugify(subcategory)}`}
        </PageHeaderDescription>
      </PageHeader>
      {/* <Products
        products={productsTransaction.data}
        pageCount={productsTransaction.pageCount}
        stores={storesTransaction.data}
        storePageCount={storesTransaction.pageCount}
      /> */}
    </Shell>
  );
}
