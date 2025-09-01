import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header';
import { Shell } from '@/components/shell';
import ProductListingPage from '../search/_components/plp';

type CatalogPageProps = {
  params: {
    catalog: string;
  };
};

export default function CatalogPage({ params }: CatalogPageProps) {
  return (
    <Shell>
      <PageHeader>
        <PageHeaderHeading size="sm">{params.catalog}</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Buy products from our stores
        </PageHeaderDescription>
      </PageHeader>
      <ProductListingPage />
    </Shell>
  );
}
