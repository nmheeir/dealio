'use client';

import { useProducts } from '@/api/products/use-products';
import { columns } from '../data-table/columns';
import { DataTableLoading } from '../data-table/data-table-loading';
import { DataTable } from './data-table';

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
    <DataTable data={products} columns={columns} />
  );
}
