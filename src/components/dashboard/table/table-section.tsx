'use client';

import { useProducts } from '@/api/products/use-products';
import { DataTable } from './data-table/data-table';
import { DataTableLoading } from './data-table/data-table-loading';

export function TableSection() {
  const { data, isLoading, error } = useProducts();

  if (isLoading) {
    return <DataTableLoading />;
  }

  if (error) {
    return (
      <div>
        Error:
        {error.message}
      </div>
    );
  }

  const products = data?.data.data ? data.data.data : [];

  return (
    <DataTable data={products} />
  );
}
