import type { Order } from '@/api/schemas/order/order.schema';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, Truck } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useOrderShip } from '@/api/order/admin-manger/use-order-ship';
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

export function ManagerShipOrder({ item }: { item: Order }) {
  const { mutateAsync: shipOrder, isPending } = useOrderShip();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  if (item.status !== 'CONFIRMED') {
    return null;
  }

  async function handleShipOrder() {
    try {
      const response = await shipOrder({ orderId: item.id });

      if (response.statusCode === 200) {
        toast.success('Đơn hàng đã được gửi cho đơn vị vận chuyển');
        queryClient.invalidateQueries({
          queryKey: ['orders/admin-manager/find-all', 'orders'],
        });
        setOpen(false); // đóng dialog khi thành công
      } else if (response.statusCode === 400) {
        toast.error(response.message || 'Đơn hàng này không thể gửi vận chuyển');
      } else {
        toast.error(response.message || 'Có lỗi xảy ra, vui lòng thử lại');
      }
    } catch (e: any) {
      console.error(e);
      toast.error(
        e?.response?.data?.message
        || e?.message
        || 'Gửi đơn hàng thất bại',
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
          <Truck className="mr-2 h-4 w-4" />
          Gửi đơn hàng
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Gửi đơn hàng</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc muốn gửi đơn hàng #
            {item.id}
            {' '}
            cho đơn vị vận chuyển không?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Quay lại</AlertDialogCancel>
          <Button
            variant="default"
            disabled={isPending}
            onClick={handleShipOrder}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? 'Đang xử lý...' : 'Đồng ý'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
