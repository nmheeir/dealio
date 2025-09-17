'use client';

import { useOrderGetAll } from '@/api/order/use-order-get-all';
import { DataTable } from '@/components/dashboard/data-table/data-table';
import { DataTableLoading } from '@/components/dashboard/data-table/data-table-loading';
import { orderColumns } from './order-columns';

export function OrderTable() {
  const { data, isLoading, error } = useOrderGetAll();

  if (isLoading) {
    return <DataTableLoading />;
  }

  if (error) {
    return <span>Error</span>;
  }

  const orders = data?.data.data ?? [];

  return (
    <div className="m-8">
      <DataTable
        columns={orderColumns}
        data={orders}
      />
    </div>
  );
}
