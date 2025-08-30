import type { Metadata } from 'next';

import type { SearchParams } from '@/types';

import SearchView from '@/components/search/search-view';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Buy products from our stores',
};

type ProductsPageProps = {
  searchParams: SearchParams;
};

export default function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  return (
    <SearchView />
  );
}
