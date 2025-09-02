import MoreProductSection from './_components/more-product';
import ProductDetailSection from './_components/product-detail';

export { generateMetadata } from './metadata';

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage(props: ProductPageProps) {
  const params = await props.params;
  const { slug } = params;

  return (
    <div className="relative mx-auto pt-4 xl:px-0">
      <ProductDetailSection slug={slug} />
      {/* More product */}
      <MoreProductSection variantId={slug} />
    </div>
  );
}
