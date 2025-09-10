import { CategoryTable } from './_components/category-table';
import { NewCategoryButton } from './_components/new-category';

export default function DashboardCategoryPage() {
  return (
    <div className="space-y-4 py-4">
      <NewCategoryButton />
      <CategoryTable />
    </div>
  );
}
