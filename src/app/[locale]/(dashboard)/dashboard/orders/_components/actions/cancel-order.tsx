import type { Order } from '@/api/schemas/order/order.schema';
import { useQueryClient } from '@tanstack/react-query';
import { XCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useCancelOrder as useOrderCancel } from '@/api/order/physical/use-order-cancel';
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

export function CancelOrder({ item }: { item: Order }) {
  const { mutateAsync: cancelOrder } = useOrderCancel();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const cancellableStatuses = ['PENDING_CONFIRMATION', 'PENDING_PAYMENT'];
  if (
    item.order_type !== 'PHYSICAL'
    || !cancellableStatuses.includes(item.status)
  ) {
    return null;
  }

  async function handleCancelOrder() {
    try {
      const response = await cancelOrder({
        orderId: item.id,
      });

      if (response.statusCode === 200) {
        toast.success('Hủy đơn hàng thành công');
        queryClient.invalidateQueries({
          queryKey: ['orders'],
        }); // reload list
      } else if (response.statusCode === 400) {
        toast.error('Đơn hàng không thể hủy');
      } else {
        toast.error('Có lỗi xảy ra, vui lòng thử lại');
      }
    } catch (e) {
      console.error(e);
      toast.error('Hủy đơn hàng thất bại');
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
          <XCircle className="mr-2 h-4 w-4" />
          Hủy đơn hàng
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận hủy đơn hàng</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn hủy đơn hàng #
            {item.id}
            ? Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Quay lại</AlertDialogCancel>
          <AlertDialogAction onClick={handleCancelOrder}>
            Xác nhận
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
