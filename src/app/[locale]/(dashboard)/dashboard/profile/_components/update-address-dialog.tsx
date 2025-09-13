/* eslint-disable no-console */
'use client';

import type { Address, AddressInput } from '@/api/schemas/user/adddress.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useUpdateAddress } from '@/api/address/use-update-address';
import { addressInputSchema } from '@/api/schemas/user/adddress.schema';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/hooks/use-mobile';

type EditAddressDialogProps = {
  address: Address;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
};

export function EditAddressDialog({ address, open, onOpenChangeAction }: EditAddressDialogProps) {
  const isMobile = useIsMobile();
  const { mutateAsync: updateAddress } = useUpdateAddress();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    ...form
  } = useForm<AddressInput>({
    resolver: zodResolver(addressInputSchema),
  });

  React.useEffect(() => {
    if (address) {
      form.reset({
        to_name: address.to_name,
        to_phone: address.to_phone,
        to_address: address.to_address,
        to_ward_code: address.to_ward_code,
        to_district_id: address.to_district_id,
        to_province_name: address.to_province_name,
      });
    }
  }, [address]);

  const onSubmit = async (data: AddressInput) => {
    try {
      console.log('🚀 Gửi request update địa chỉ:', data);
      await updateAddress({ id: address.id, updateData: data });
      console.log('✅ Cập nhật địa chỉ thành công');
      await queryClient.invalidateQueries({ queryKey: ['addresses'] });
      onOpenChangeAction(false);
    } catch (err) {
      console.error('❌ Lỗi khi cập nhật địa chỉ:', err);
    }
  };

  const FormUI = (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField id="to_name" label="Họ tên" placeholder="Jane Smith" register={register} error={errors.to_name?.message} />
        <FormField id="to_phone" label="Số điện thoại" placeholder="9876543210" register={register} error={errors.to_phone?.message} />
      </div>

      <FormField id="to_address" label="Địa chỉ" placeholder="123 Pine St" register={register} error={errors.to_address?.message} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField id="to_district_id" label="Mã quận/huyện" placeholder="123" register={register} error={errors.to_district_id?.message} />
        <FormField id="to_ward_code" label="Mã phường/xã" placeholder="00456" register={register} error={errors.to_ward_code?.message} />
      </div>

      <FormField id="to_province_name" label="Tỉnh/Thành phố" placeholder="TP Hồ Chí Minh" register={register} error={errors.to_province_name?.message} />

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => onOpenChangeAction(false)}>Hủy</Button>
        <Button type="submit">Cập nhật</Button>
      </div>
    </form>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChangeAction}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Cập nhật địa chỉ</DrawerTitle>
            <DrawerDescription>Chỉnh sửa thông tin địa chỉ giao hàng.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4">{FormUI}</div>
          <DrawerFooter />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật địa chỉ</DialogTitle>
          <DialogDescription>Chỉnh sửa thông tin địa chỉ giao hàng.</DialogDescription>
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
