/* eslint-disable no-console */
'use client';

import type { AddressInput } from '@/api/schemas/user/adddress.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAddAddress } from '@/api/address/use-add-address';
import { addressInputSchema } from '@/api/schemas/user/adddress.schema';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/hooks/use-mobile';

export function AddAddressDialog() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const { mutateAsync } = useAddAddress();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddressInput>({
    resolver: zodResolver(addressInputSchema),
    defaultValues: {
      to_name: '',
      to_phone: '',
      to_address: '',
      to_ward_code: '',
      to_district_id: '',
      to_province_name: '',
    },
  });

  const onSubmit = async (data: AddressInput) => {
    console.log('🚀 Bắt đầu gửi dữ liệu thêm địa chỉ...');
    console.log('📦 Payload gửi đi:', data);

    try {
      const response = await mutateAsync(data);

      console.log('✅ Thêm địa chỉ thành công!');
      console.log('📥 API Response:', response);

      // 🔄 Làm mới lại danh sách địa chỉ
      await queryClient.invalidateQueries({ queryKey: ['addresses'] });

      setOpen(false);
      reset();
    } catch (error) {
      console.error('❌ Lỗi khi thêm địa chỉ:', error);
    }
  };

  const FormUI = (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) => {
        console.log('❌ Validation errors:', errors);
      })}
      className="space-y-4"
    >
      {/* Họ tên + Số điện thoại */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          id="to_name"
          label="Họ tên"
          placeholder="Jane Smith"
          register={register}
          error={errors.to_name?.message}
        />
        <FormField
          id="to_phone"
          label="Số điện thoại"
          placeholder="9876543210"
          register={register}
          error={errors.to_phone?.message}
        />
      </div>

      {/* Địa chỉ */}
      <FormField
        id="to_address"
        label="Địa chỉ"
        placeholder="123 Pine St"
        register={register}
        error={errors.to_address?.message}
      />

      {/* Mã quận/huyện + Mã phường/xã */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          id="to_district_id"
          label="Mã quận/huyện"
          placeholder="123"
          register={register}
          error={errors.to_district_id?.message}
        />
        <FormField
          id="to_ward_code"
          label="Mã phường/xã"
          placeholder="00456"
          register={register}
          error={errors.to_ward_code?.message}
        />
      </div>

      {/* Tỉnh/Thành phố */}
      <FormField
        id="to_province_name"
        label="Tỉnh/Thành phố"
        placeholder="TP Hồ Chí Minh"
        register={register}
        error={errors.to_province_name?.message}
      />

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
          Hủy
        </Button>
        <Button type="submit">Lưu</Button>
      </div>
    </form>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button>Thêm địa chỉ mới</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Thêm địa chỉ mới</DrawerTitle>
            <DrawerDescription>
              Nhập thông tin chi tiết cho địa chỉ giao hàng.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">{FormUI}</div>
          <DrawerFooter />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Thêm địa chỉ mới</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm địa chỉ mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin chi tiết cho địa chỉ giao hàng.
          </DialogDescription>
        </DialogHeader>
        {FormUI}
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}

type FormFieldProps = {
  id: string;
  label: string;
  placeholder?: string;
  register: any;
  error?: string;
};

function FormField({ id, label, placeholder, register, error }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} placeholder={placeholder} {...register(id)} />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
