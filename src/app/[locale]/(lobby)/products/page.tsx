import type { Metadata } from 'next';

import type { SearchParams } from '@/types';
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from '@/components/page-header';
import { ProductCard } from '@/components/product-card';
import ProductList from '@/components/product-list';
import { Shell } from '@/components/shell';

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
  return (
    <Shell>
      <PageHeader>
        <PageHeaderHeading size="sm">Products</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Buy products from our stores
        </PageHeaderDescription>
      </PageHeader>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key, ts/no-use-before-define
          <ProductCard key={i} product={fakeProduct} variant="switchable" />
        ))}
        <ProductList />
      </div>
    </Shell>
  );
}

// mock-data.ts
const fakeProduct = {
  id: '0bee329d-b596-4d23-acfe-47c2ac2c6e8d',
  name: 'Áo thun basic nam',
  price: '199000', // chuỗi, vì decimal
  images: [
    // {
    //   id: 'file_1',
    //   url: 'https://picsum.photos/400/300?random=1',
    //   name: 'ao-thun-basic.jpg',
    //   size: 102400,
    //   type: 'image/jpeg',
    // },
  ],
  inventory: 42,
  category: 'Thời trang nam',
};
