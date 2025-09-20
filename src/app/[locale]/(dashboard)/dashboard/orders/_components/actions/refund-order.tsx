'use client';

import type { Order } from '@/api/schemas/order/order.schema';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRefundRequest } from '@/api/refund/use-refund-request';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type RefundOrderProps = {
  item: Order;
};

export function RefundOrder({ item }: RefundOrderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reason, setReason] = useState('');

  const { mutate: requestRefund, isPending } = useRefundRequest({
    onSuccess: () => {
      toast.success('Yêu cầu hoàn tiền của bạn đã được gửi, vui lòng chờ Manager/Admin xử lý');
      setIsDialogOpen(false);
      setReason('');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi gửi yêu cầu hoàn tiền';
      toast.error(errorMessage);
    },
  });

  // Kiểm tra điều kiện hiển thị nút "Yêu cầu hoàn tiền"
  const canRequestRefund
    = ['PAID', 'CONFIRM', 'SHIPPED', 'COMPLETED'].includes(item.status)
      && item.order_type !== 'DIGITAL';

  if (!canRequestRefund) {
    return null;
  }

  const handleSubmit = () => {
    if (!reason.trim()) {
      toast.error('Vui lòng nhập lý do hoàn tiền');
      return;
    }

    if (item.order_type === 'DIGITAL') {
      toast.error('Đơn hàng digital không hỗ trợ hoàn tiền! Vui lòng xem lại chính sách');
      return;
    }

    if (!['PAID', 'CONFIRM', 'SHIPPED', 'COMPLETED'].includes(item.status)) {
      toast.error('Đơn hàng này không đủ điều kiện để yêu cầu hoàn tiền');
      return;
    }

    if (['PENDING', 'APPROVED'].includes(item.refundStatus)) {
      toast.error('Bạn đã gửi yêu cầu hoàn tiền cho đơn hàng này, vui lòng chờ xử lý');
      return;
    }

    requestRefund({ orderId: item.id, reason });
  };

  return (
    <>
      <DropdownMenuItem
        onClick={(e) => {
          e.preventDefault();
          setIsDialogOpen(true);
        }}
        className="cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        Yêu cầu hoàn tiền
      </DropdownMenuItem>

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
    </>
  );
}
