'use client';

import React from 'react';
import { useBrands } from '@/api/brand/use-brand';
import { DataTable } from '@/components/dashboard/data-table/data-table';
import { DataTableLoading } from '@/components/dashboard/data-table/data-table-loading';
import { brandColumns } from './brand-columns';

export function BrandTable() {
  const { data, isLoading, error } = useBrands();

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

  const brands = data?.data.data ? data.data.data : [];

  return (
    <div className="mt-8 px-8">
      <DataTable
        data={brands}
        columns={brandColumns}
      />
    </div>
  );
}
