'use client';

import { useRefundGetAll } from '@/api/refund/use-refund-get-all';
import { DataTable } from '@/components/dashboard/data-table/data-table';
import { DataTableLoading } from '@/components/dashboard/data-table/data-table-loading';
import { refundColumns } from './refund-columns';

export function RefundTable() {
  const { data, isLoading, error } = useRefundGetAll();
  if (isLoading) {
    return <DataTableLoading />;
  }
  if (error) {
    return <span>{error.message}</span>;
  }

  const refunds = data?.data.data ?? [];
  return (
    <div className="m-8">
      <DataTable
        data={refunds}
        columns={refundColumns}
      />
    </div>
  );
}
