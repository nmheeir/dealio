import type { Metadata } from 'next';

import SearchView from '@/components/search/search-view';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Buy products from our stores',
};

type SearchPageProps = {
  searchParams: { q?: string };
};

export default function ProductsPage({ searchParams }: SearchPageProps) {
  return <SearchView query={searchParams.q} />;
}
