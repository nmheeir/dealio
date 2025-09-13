'use client';

import { useGetAllUsers } from '@/api/users/use-get-users-admin';
import { DataTable } from '@/components/dashboard/data-table/data-table';
import { DataTableLoading } from '@/components/dashboard/data-table/data-table-loading';
import { userColumns } from './user-columns';

export function UserTable() {
  const { data, isLoading, error } = useGetAllUsers();

  if (isLoading) {
    return <DataTableLoading />;
  }

  if (error) {
    return <div className="">{error.message}</div>;
  }

  const users = data?.data.data ?? [];

  return (
    <div>
      <DataTable
        data={users}
        columns={userColumns}
      />
    </div>
  );
}
