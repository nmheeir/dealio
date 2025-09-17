/* eslint-disable no-console */
'use client';

import type { Address } from '@/api/schemas/user/adddress.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useUpdateAddress } from '@/api/address/use-update-address';
import { useGetDistrictByProvinceId } from '@/api/ghn/use-get-district';
import { useGetAllProvinces } from '@/api/ghn/use-get-provinces';
import { useGetWardsByDistrictId } from '@/api/ghn/use-get-wards';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import { data } from "../../data";

type EditAddressDialogProps = {
  address: Address;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
};

// Schema cho form, sử dụng to_province_id để quản lý dropdown
const adjustedAddressInputSchema = z.object({
  to_name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  to_phone: z
    .string()
    .regex(/^\d+$/, 'Số điện thoại chỉ chứa chữ số')
    .min(9, 'Số điện thoại phải có ít nhất 9 số'),
  to_address: z.string().min(5, 'Địa chỉ quá ngắn'),
  to_province_id: z.number().min(1, 'Vui lòng chọn tỉnh/thành phố'),
  to_district_id: z.number().min(1, 'Vui lòng chọn quận/huyện'),
  to_ward_code: z.number().min(1, 'Vui lòng chọn phường/xã'),
});

export function TestEditAddressDialog({ address, open, onOpenChangeAction }: EditAddressDialogProps) {
  const isMobile = useIsMobile();
  const { mutateAsync: updateAddress } = useUpdateAddress();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<z.infer<typeof adjustedAddressInputSchema>>({
    resolver: zodResolver(adjustedAddressInputSchema),
    defaultValues: {
      to_name: '',
      to_phone: '',
      to_address: '',
      to_province_id: undefined,
      to_district_id: undefined,
      to_ward_code: undefined,
    },
  });

  const provinceId = watch('to_province_id');
  const districtId = watch('to_district_id');

  // Fetch provinces
  const { data: provincesData, isLoading: provincesLoading, error: provincesError } = useGetAllProvinces();
  const provinces = provincesData?.data ?? [];

  // Fetch districts dựa trên provinceId
  const { data: districtsData, isLoading: districtsLoading, error: districtsError } = useGetDistrictByProvinceId({
    variables: { provinceId: provinceId! },
    enabled: !!provinceId,
  });
  const districts = districtsData?.data ?? [];

  // Fetch wards dựa trên districtId
  const { data: wardsData, isLoading: wardsLoading, error: wardsError } = useGetWardsByDistrictId({
    variables: { districtId: districtId! },
    enabled: !!districtId,
  });
  const wards = wardsData?.data ?? [];

  // Memoize province tìm được để tránh re-render không cần thiết
  const selectedProvince = useMemo(() => {
    return provinces.find(p => p.ProvinceName === address.to_province_name);
  }, [provinces, address.to_province_name]);

  // Set giá trị ban đầu từ address prop
  useEffect(() => {
    if (address && selectedProvince && open) {
      reset({
        to_name: address.to_name,
        to_phone: address.to_phone,
        to_address: address.to_address,
        to_province_id: selectedProvince.ProvinceID,
        to_district_id: address.to_district_id,
        to_ward_code: address.to_ward_code,
      });
    }
  }, [address, selectedProvince, open, reset]);

  // Reset district và ward khi province thay đổi
  useEffect(() => {
    if (provinceId) {
      setValue('to_district_id', undefined);
      setValue('to_ward_code', undefined);
    }
  }, [provinceId, setValue]);

  // Reset ward khi district thay đổi
  useEffect(() => {
    if (districtId) {
      setValue('to_ward_code', undefined);
    }
  }, [districtId, setValue]);

  // Xử lý lỗi fetch API
  useEffect(() => {
    if (provincesError) {
      toast('Lỗi', {
        description: 'Không thể tải danh sách tỉnh/thành phố.',
      });
    }
    if (districtsError) {
      toast('Lỗi', {
        description: 'Không thể tải danh sách quận/huyện.',
      });
    }
    if (wardsError) {
      toast('Lỗi', {
        description: 'Không thể tải danh sách phường/xã.',
      });
    }
  }, [provincesError, districtsError, wardsError]);

  const onSubmit = async (data: z.infer<typeof adjustedAddressInputSchema>) => {
    try {
      // Ánh xạ to_province_id sang to_province_name để khớp với addressInputSchema
      const province = provinces.find(p => p.ProvinceID === data.to_province_id);
      if (!province) {
        throw new Error('Tỉnh/thành phố không hợp lệ');
      }

      // Tạo payload khớp với addressInputSchema
      const payload = {
        to_name: data.to_name,
        to_phone: data.to_phone,
        to_address: data.to_address,
        to_ward_code: String(data.to_ward_code), // ép sang string
        to_district_id: data.to_district_id,
        to_province_name: province.ProvinceName,
      };

      console.log('🚀 Gửi request update địa chỉ:', payload);
      await updateAddress({ id: address.id, updateData: payload });

      toast.success('Cập nhật địa chỉ thành công.');
      await queryClient.invalidateQueries({ queryKey: ['addresses'] });
      onOpenChangeAction(false);
    } catch (err) {
      console.error('❌ Lỗi khi cập nhật địa chỉ:', err);
      toast.error('Không thể cập nhật địa chỉ. Vui lòng thử lại.');
    }
  };

  const FormUI = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField id="to_name" label="Họ tên" placeholder="Jane Smith" register={register} error={errors.to_name?.message} />
        <FormField id="to_phone" label="Số điện thoại" placeholder="9876543210" register={register} error={errors.to_phone?.message} />
      </div>

      <FormField id="to_address" label="Địa chỉ" placeholder="123 Pine St" register={register} error={errors.to_address?.message} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="to_province_id">Tỉnh/Thành phố</Label>
          <Select
            value={provinceId?.toString()}
            onValueChange={value => setValue('to_province_id', Number(value))}
            disabled={provincesLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn tỉnh/thành phố" />
            </SelectTrigger>
            <SelectContent>
              {provinces.map(province => (
                <SelectItem key={province.ProvinceID} value={province.ProvinceID.toString()}>
                  {province.ProvinceName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(errors.to_province_id?.message || provincesError) && (
            <p className="text-sm text-red-500">{errors.to_province_id?.message || 'Lỗi tải tỉnh/thành phố'}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="to_district_id">Quận/Huyện</Label>
          <Select
            value={districtId?.toString()}
            onValueChange={value => setValue('to_district_id', Number(value))}
            disabled={districtsLoading || !provinceId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn quận/huyện" />
            </SelectTrigger>
            <SelectContent>
              {districts.map(district => (
                <SelectItem key={district.DistrictID} value={district.DistrictID.toString()}>
                  {district.DistrictName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(errors.to_district_id?.message || districtsError) && (
            <p className="text-sm text-red-500">{errors.to_district_id?.message || 'Lỗi tải quận/huyện'}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="to_ward_code">Phường/Xã</Label>
        <Select
          value={watch('to_ward_code')?.toString()}
          onValueChange={value => setValue('to_ward_code', Number(value))}
          disabled={wardsLoading || !districtId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn phường/xã" />
          </SelectTrigger>
          <SelectContent>
            {wards.map(ward => (
              <SelectItem key={ward.WardCode} value={ward.WardCode.toString()}>
                {ward.WardName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(errors.to_ward_code?.message || wardsError) && (
          <p className="text-sm text-red-500">{errors.to_ward_code?.message || 'Lỗi tải phường/xã'}</p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => onOpenChangeAction(false)}>
          Hủy
        </Button>
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
  type?: string;
};

function FormField({ id, label, placeholder, register, error, type = 'text' }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        placeholder={placeholder}
        type={type}
        {...register(id, type === 'number' ? { valueAsNumber: true } : {})}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
