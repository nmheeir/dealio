import { AnimatedProductSection } from '../_components/animated-product-section';

type DashboardProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function DashboardProductDetailPage(props: DashboardProductDetailPageProps) {
  const params = await props.params;
  const { slug } = params;

  return (
    <div className="flex flex-col">
      <AnimatedProductSection slug={slug} />
    </div>
  );
}
