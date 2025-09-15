import type { Metadata } from 'next';
import { getProduct } from '@/api/seo/get-product';

type ProductProps = {
  params: { slug: string; locale: string };
};

export async function generateMetadata({ params }: ProductProps): Promise<Metadata> {
  // eslint-disable-next-line unused-imports/no-unused-vars
  const { slug, locale } = params;

  const product = await getProduct(slug);

  // if (!product) {
  //   notFound();
  // }

  return {
    title: product?.name || 'Default title',
    description: product?.description || 'Default description',
  };
}
