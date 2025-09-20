'use client';

import type { Order } from '@/api/schemas/order/order.schema';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRefundRequest } from '@/api/refund/use-refund-request';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type RefundOrderProps = {
  item: Order;
};

export function RefundOrder({ item }: RefundOrderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [reason, setReason] = useState('');

  const { mutate: requestRefund, isPending } = useRefundRequest({
    onSuccess: () => {
      toast.success(
        'Yêu cầu hoàn tiền của bạn đã được gửi, vui lòng chờ Manager/Admin xử lý',
      );
      setIsDialogOpen(false);
      setReason('');
    },
    onError: (error) => {
      const errorMessage
        = error.response?.data?.message
          || 'Có lỗi xảy ra khi gửi yêu cầu hoàn tiền';
      toast.error(errorMessage);
    },
  });

  // Handler gửi yêu cầu
  const handleSubmit = () => {
    if (!reason.trim()) {
      toast.error('Vui lòng nhập lý do hoàn tiền');
      return;
    }

    requestRefund({ orderId: item.id, reason });
  };

  // Logic khi click vào "Yêu cầu hoàn tiền"
  const handleClick = () => {
    if (item.order_type === 'DIGITAL') {
      toast.error(
        'Đơn hàng digital không hỗ trợ hoàn tiền! Vui lòng xem lại chính sách',
      );
      return;
    }

    if (item.payment_method === 'COD') {
      if (item.status === 'COMPLETED') {
        setIsDialogOpen(true);
        return;
      }

      if (['CONFIRMED', 'SHIPPED'].includes(item.status)) {
        setIsAlertOpen(true);
        return;
      }

      toast.error('Đơn hàng COD không đủ điều kiện để yêu cầu hoàn tiền');
      return;
    }

    if (item.payment_method === 'MOMO_WALLET') {
      if (['PAID', 'CONFIRMED', 'SHIPPED', 'COMPLETED'].includes(item.status)) {
        setIsDialogOpen(true);
        return;
      }

      toast.error('Đơn hàng MOMO không đủ điều kiện để yêu cầu hoàn tiền');
      return;
    }

    toast.error('Đơn hàng này không đủ điều kiện để yêu cầu hoàn tiền');
  };

  return (
    <>
      <DropdownMenuItem
        onClick={(e) => {
          e.preventDefault();
          handleClick();
        }}
        className="cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        Yêu cầu hoàn tiền
      </DropdownMenuItem>

      {/* Dialog nhập lý do refund */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Yêu cầu hoàn tiền</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason">Lý do hoàn tiền</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Vui lòng nhập lý do yêu cầu hoàn tiền"
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isPending ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog cho COD: CONFIRMED / SHIPPED */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Không thể yêu cầu hoàn tiền</AlertDialogTitle>
            <AlertDialogDescription>
              Đơn hàng COD ở trạng thái
              {' '}
              <strong>{item.status}</strong>
              . Vui lòng liên hệ Admin hoặc Manager
              để được hỗ trợ hủy đơn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>
              Đóng
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => setIsAlertOpen(false)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Tôi đã hiểu
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
