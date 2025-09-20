import type { Order } from '@/api/schemas/order/order.schema';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useOrderConfirm } from '@/api/order/admin-manger/use-order-confirm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

export function ManagerConfirmOrder({ item }: { item: Order }) {
  const { mutateAsync: confirmOrder } = useOrderConfirm();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const confirmableStatuses = ['PENDING_CONFIRMATION', 'PAID'];
  if (!confirmableStatuses.includes(item.status)) {
    return null;
  }

  async function handleConfirmOrder() {
    try {
      const response = await confirmOrder({ orderId: item.id });

      if (response.statusCode === 200) {
        toast.success('Đơn hàng đã được xác nhận thành công');
        queryClient.invalidateQueries({ queryKey: ['orders/admin-manager/find-all'] });
      } else {
        // Ưu tiên lấy message từ API
        toast.error(response.message || 'Có lỗi xảy ra, vui lòng thử lại');
      }
    } catch (e: any) {
      console.error(e);

      // Nếu e có response từ server (tuỳ bạn đang dùng fetch/axios/react-query)
      const apiMessage
        = e?.response?.data?.message // axios
          || e?.message // JS Error object
          || 'Xác nhận đơn hàng thất bại';

      toast.error(apiMessage);
    } finally {
      setOpen(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Xác nhận đơn hàng
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận đơn hàng</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc muốn xác nhận đơn hàng #
            {item.id}
            {' '}
            này không?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Quay lại</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmOrder}>
            Đồng ý
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
