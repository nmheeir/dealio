import React from 'react';
import { BrandTable } from './_components/brand-table';
import { NewBrandButton } from './_components/new-brand';

export default function DashboardBrandPage() {
  return (
    <div className="space-y-4 py-4">
      <NewBrandButton />
      <BrandTable />
    </div>
  );
}
