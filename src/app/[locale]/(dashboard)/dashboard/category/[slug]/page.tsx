type DashboardCategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function DashboardCategoryPage(props: DashboardCategoryPageProps) {
  const params = await props.params;
  const { slug } = params;
  return (
    <div>
      Dashboard Category Page:
      {slug}
    </div>
  );
}
