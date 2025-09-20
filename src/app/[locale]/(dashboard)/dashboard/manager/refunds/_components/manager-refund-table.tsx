'use client';

import { useRefundRequestGetAll } from '@/api/refund/use-refund-request-get-all';
import { DataTable } from '@/components/dashboard/data-table/data-table';
import { DataTableLoading } from '@/components/dashboard/data-table/data-table-loading';
import { managerRefundColumns } from './manager-refund-columns';

export function ManagerRefundTable() {
  const { data, isLoading, error } = useRefundRequestGetAll(
    {
      variables: {
        status: 'PENDING',
      },
    },
  );

  if (isLoading) {
    return <DataTableLoading />;
  }

  if (error) {
    return <span>{error.message}</span>;
  }

  const refundRequests = data?.data.data ?? [];

  return (
    <DataTable
      data={refundRequests}
      columns={managerRefundColumns}
    />
  );
}
