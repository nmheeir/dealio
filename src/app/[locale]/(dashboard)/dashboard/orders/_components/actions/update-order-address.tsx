import type { Order } from '@/api/schemas/order/order.schema';
import { useQueryClient } from '@tanstack/react-query';
import { MapPin } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAddresses } from '@/api/address/use-addressed';
// hooks
import { useOrderChangeAddress } from '@/api/order/physical/use-order-change-address';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const ALLOWED_STATUSES = [
  'PENDING_CONFIRMATION',
  'PENDING_PAYMENT',
  'PAID',
];

export function UpdateAddress({ item }: { item: Order }) {
  const [open, setOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const { data: addressesResponse, isLoading } = useAddresses();
  const { mutateAsync: changeAddress } = useOrderChangeAddress();
  const queryClient = useQueryClient();

  if (!(item.order_type === 'PHYSICAL' && ALLOWED_STATUSES.includes(item.status))) {
    return null;
  }

  async function handleConfirm() {
    if (!selectedAddressId) {
      toast.error('Vui lòng chọn địa chỉ giao hàng');
      return;
    }
    try {
      const res = await changeAddress({
        orderId: item.id,
        addressId: selectedAddressId,
      });

      if (res.statusCode === 200) {
        toast.success('Địa chỉ giao hàng đã được cập nhật thành công.');
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        setOpen(false);
      } else {
        toast.error('Không thể cập nhật địa chỉ. Vui lòng thử lại.');
      }
    } catch (e: any) {
      console.error(e);
      toast.error('Cập nhật địa chỉ thất bại.');
    }
  }
  const addresses = addressesResponse?.data.data ?? [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={e => e.preventDefault()}
          className="cursor-pointer"
        >
          <MapPin className="mr-2 h-4 w-4" />
          Đổi địa chỉ giao hàng
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chọn địa chỉ giao hàng mới</DialogTitle>
        </DialogHeader>

        {isLoading
          ? (
              <p className="text-sm text-muted-foreground">Đang tải danh sách địa chỉ...</p>
            )
          : addresses && addresses.length > 0
            ? (
                <RadioGroup
                  value={selectedAddressId || ''}
                  onValueChange={setSelectedAddressId}
                >
                  {addresses.map(addr => (
                    <div key={addr.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={addr.id} id={addr.id} />
                      <Label htmlFor={addr.id}>
                        {addr.to_name}
                        ,
                        {addr.to_phone}
                        {' '}
                        -
                        {addr.to_address}
                        ,
                        {addr.to_province_name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )
            : (
                <p className="text-sm text-muted-foreground">
                  Bạn chưa có địa chỉ giao hàng nào. Vui lòng thêm địa chỉ mới trong Tài khoản.
                </p>
              )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!addresses || addresses.length === 0}
          >
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
