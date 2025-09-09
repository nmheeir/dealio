'use client';
import React from 'react';
import { useAddresses } from '@/api/address/use-addressed';
import AddressList from './address_list';

export default function AddressSection() {
  const { data, isLoading, error } = useAddresses();

  if (isLoading) {
    return <span>Loading</span>;
  }

  if (error || !data) {
    return <span>No data</span>;
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
