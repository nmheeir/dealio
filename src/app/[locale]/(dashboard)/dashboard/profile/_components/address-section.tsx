'use client';
import { AlertTriangle } from 'lucide-react';
import React from 'react';
import { useAddresses } from '@/api/address/use-addressed';
import { Skeleton } from '@/components/ui/skeleton';
import AddressList from './address_list';

export default function AddressSection() {
  const { data, isLoading, error } = useAddresses();

  if (isLoading) {
    return <AddressSectionSkeleton />;
  }

  if (error || !data) {
    return <NoData />;
  }

  const addresses = data.data.data;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Địa chỉ giao hàng</h2>
        <p className="text-sm text-muted-foreground">
          Quản lý các địa chỉ bạn đã lưu để sử dụng khi thanh toán
        </p>
      </div>
      <AddressList data={addresses} />
    </div>
  );
}

function AddressSectionSkeleton() {
  return (
    <div className="space-y-4">
      <div>
        <Skeleton className="mb-2 h-7 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="space-y-4">
        {[...Array.from({ length: 3 })].map((_, index) => (
          <div key={index} className="space-y-2 rounded-lg border p-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-36" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NoData() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertTriangle className="mb-4 h-12 w-12 text-muted-foreground" />
      <h3 className="text-lg font-semibold text-foreground">Không có dữ liệu</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Hiện tại không có thông tin nào để hiển thị.
      </p>
    </div>
  );
}
