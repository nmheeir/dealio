import type { Metadata } from 'next';
import { getProduct } from '@/api/seo/get-product';

type ProductProps = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata({ params }: ProductProps): Promise<Metadata> {
  const { slug } = await params;

  const product = await getProduct(slug);

  // if (!product) {
  //   notFound();
  // }

  return {
    title: product?.name || 'Buy product',
    description: product?.description || 'Buy product',
  };
}
