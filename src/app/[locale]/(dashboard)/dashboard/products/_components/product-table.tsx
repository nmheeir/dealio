'use client';

import { useGetAllProducts } from '@/api/products/use-all-product';
import { DataTable } from '@/components/dashboard/data-table/data-table';
import { DataTableLoading } from '@/components/dashboard/data-table/data-table-loading';
import { productColumns } from './product-columns';

export function ProductTable() {
  const { data, isLoading, error } = useGetAllProducts();

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
    <div className="mt-8 px-8">
      <DataTable data={products} columns={productColumns} />
    </div>
  );
}
