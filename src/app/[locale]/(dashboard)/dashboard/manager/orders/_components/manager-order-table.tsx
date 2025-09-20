'use client';

import { useOrderFindAll } from '@/api/order/admin-manger/use-order-find-all';
import { DataTable } from '@/components/dashboard/data-table/data-table';
import { DataTableLoading } from '@/components/dashboard/data-table/data-table-loading';
import { managerOrderColumns } from './manage-order-columns';

export function ManagerOrderTable() {
  const { data, isLoading, error } = useOrderFindAll();

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
        columns={managerOrderColumns}
        data={orders}
      />
    </div>
  );
}
