'use client';

import { useGetAllCustomers } from '@/api/users/use-get-customer-manager';
import { DataTable } from '@/components/dashboard/data-table/data-table';
import { DataTableLoading } from '@/components/dashboard/data-table/data-table-loading';
import { userProfileColumn } from './user-profile-columns';

export default function UserProfileTable() {
  const { data, isLoading, error } = useGetAllCustomers();

  if (isLoading) {
    return <DataTableLoading />;
  }

  if (error) {
    return <div className="">{error.message}</div>;
  }

  if (!data) {
    return <div className="">Not data</div>;
  }

  const customers = data.data.data;

  return (
    <div className="mt-8 px-8">
      <DataTable
        data={customers}
        columns={userProfileColumn}
      />
    </div>
  );
}
