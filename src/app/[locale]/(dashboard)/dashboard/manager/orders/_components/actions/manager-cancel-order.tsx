import type { Order } from '@/api/schemas/order/order.schema';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, XCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useOrderAdminManagerCancel } from '@/api/order/admin-manger/use-order-manager-cancel';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

export function ManagerCancelOrder({ item }: { item: Order }) {
  const { mutateAsync: cancelOrder, isPending } = useOrderAdminManagerCancel();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const cancellableStatuses = [
    'PENDING_CONFIRMATION',
    'CONFIRMED',
    'SHIPPED',
  ];
  if (
    !cancellableStatuses.includes(item.status)
    || item.order_type !== 'PHYSICAL'
  ) {
    return null;
  }

  async function handleCancelOrder() {
    try {
      const response = await cancelOrder({ orderId: item.id });

      if (response.statusCode === 200) {
        toast.success(
          item.status === 'SHIPPED'
            ? 'Yêu cầu hủy giao hàng thành công'
            : 'Hủy đơn hàng thành công',
        );
        queryClient.invalidateQueries({
          queryKey: ['orders/admin-manager/find-all'],
        });
        setOpen(false); // đóng dialog khi thành công
      } else if (response.statusCode === 400) {
        toast.error(
          item.status === 'SHIPPED'
            ? response.data.data.message || 'Yêu cầu hủy giao hàng thất bại'
            : 'Đơn hàng không thể hủy',
        );
      } else {
        toast.error(
          item.status === 'SHIPPED'
            ? response.message || 'Có lỗi xảy ra khi hủy giao hàng, vui lòng thử lại'
            : 'Có lỗi xảy ra, vui lòng thử lại',
        );
      }
    } catch (e) {
      console.error(e);
      toast.error(
        item.status === 'SHIPPED'
          ? 'Yêu cầu hủy giao hàng thất bại'
          : 'Hủy đơn hàng thất bại',
      );
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
            {item.status === 'SHIPPED'
              ? `Đơn hàng đã được gửi cho đơn vị vận chuyển. Bạn có chắc muốn yêu cầu hủy giao hàng không?`
              : `Bạn có chắc chắn muốn hủy đơn hàng #${item.id}? Hành động này không thể hoàn tác.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Quay lại</AlertDialogCancel>
          <Button
            variant="default"
            disabled={isPending}
            onClick={handleCancelOrder}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? 'Đang xử lý...' : 'Đồng ý'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
