import type { RefundRequest } from '@/api/schemas/refund/refund-request.schema';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRefundFinalizeRequest } from '@/api/refund/use-refund-finalize';
import { useRefundRequestReview } from '@/api/refund/use-refund-request-review';

import { Button } from '@/components/ui/button';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

type RefundActionHandlerProps = {
  item: RefundRequest;
};

export default function RefundActionHandler({ item }: RefundActionHandlerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [actionType, setActionType] = useState<'APPROVED' | 'REJECTED' | 'CONFIRMED' | null>(null);
  const queryClient = useQueryClient();
  const { mutate: reviewRefundRequest, isPending: isMutatePending } = useRefundRequestReview({
    onSuccess: () => {
      const statusMessage
        = actionType === 'APPROVED' ? 'phê duyệt' : actionType === 'REJECTED' ? 'từ chối' : 'xác nhận';
      toast.success(`Yêu cầu hoàn tiền đã được ${statusMessage}`, {
        description: `Trạng thái yêu cầu đã được cập nhật thành ${actionType}.`,
      });
      queryClient.invalidateQueries({ queryKey: ['refunds/admin-manager'] });
      setIsDialogOpen(false);
      setReviewNotes('');
      setRefundAmount('');
    },
    onError: (error) => {
      toast.error('Đã xảy ra lỗi khi xử lý yêu cầu hoàn tiền.', {
        description: error.message,
      });
    },
  });

  const {
    mutateAsync: refundFinalizeRequest,
    isPending: isFinalizePending,
  } = useRefundFinalizeRequest({
    onSuccess: () => {
      toast.success('Hoàn tiền thành công', {
        description: 'Yêu cầu hoàn tiền đã được xác nhận và cập nhật.',
      });
      queryClient.invalidateQueries({ queryKey: ['refunds/admin-manager'] });
      setIsDialogOpen(false);
      setReviewNotes('');
      setRefundAmount('');
      setActionType(null);
    },
    onError: (error) => {
      toast.error('Đã xảy ra lỗi khi xử lý hoàn tiền.', {
        description: error.message,
      });
    },
  });

  const handleAction = (status: 'APPROVED' | 'REJECTED' | 'CONFIRMED') => {
    if (item.status !== 'PENDING' && status !== 'CONFIRMED') {
      toast.error('Yêu cầu này đã được xử lý, không thể thay đổi.');
      return;
    }
    setActionType(status);
    if (status === 'REJECTED' || status === 'CONFIRMED') {
      setIsDialogOpen(true);
    } else {
      reviewRefundRequest({
        refund_request_id: item.id,
        status: 'APPROVED',
        review_notes: 'Approved',
      });
    }
  };

  const handleRejectSubmit = () => {
    if (!reviewNotes.trim()) {
      toast.error('Vui lòng nhập lý do từ chối yêu cầu.');
      return;
    }
    reviewRefundRequest({
      refund_request_id: item.id,
      status: 'REJECTED',
      review_notes: reviewNotes,
    });
  };

  const handleConfirmSubmit = () => {
    const amount = Number.parseFloat(refundAmount);
    if (amount <= 0) {
      toast.error('Số tiền hoàn không hợp lệ.', {
        description: 'Vui lòng nhập một số tiền hợp lệ lớn hơn 0.',
      });
      return;
    }
    if (amount > Number(item?.order?.total_amount)) {
      toast.error('Số tiền hoàn vượt quá tổng số tiền đơn hàng.', {
        description: `Số tiền tối đa có thể hoàn là ${item.order?.total_amount} VND.`,
      });
      return;
    }
    refundFinalizeRequest({
      refund_request_id: item.id,
      amount: String(amount),
    });
  };

  const isApproved = item.status === 'APPROVED';

  return (
    <>
      {(isMutatePending || isApproved) && (
        <>
          {isMutatePending && (
            <>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  handleAction('APPROVED');
                }}
              >
                Phê duyệt
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  handleAction('REJECTED');
                }}
              >
                Từ chối
              </DropdownMenuItem>
            </>
          )}
          {isApproved && (
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                handleAction('CONFIRMED');
              }}
            >
              Xác nhận hoàn tiền
            </DropdownMenuItem>
          )}
        </>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="space-y-2">
              {actionType === 'REJECTED'
                ? (
                    <div>Lý do từ chối yêu cầu hoàn tiền</div>
                  )
                : (
                    <>
                      <div>Xác nhận số tiền hoàn</div>
                      <div>
                        Số tiền tối đa có thể hoàn là
                        {' '}
                        {item.order?.total_amount}
                        {' '}
                        VND.
                      </div>
                    </>
                  )}
            </DialogTitle>

          </DialogHeader>

          <div className="py-4">
            {actionType === 'REJECTED'
              ? (
                  <Input
                    placeholder="Nhập lý do từ chối"
                    value={reviewNotes}
                    onChange={e => setReviewNotes(e.target.value)}
                    className="border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                )
              : (
                  <Input
                    type="number"
                    placeholder="Nhập số tiền hoàn (VND)"
                    value={refundAmount}
                    onChange={e => setRefundAmount(e.target.value)}
                    className="border-gray-300 focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={actionType === 'REJECTED' ? handleRejectSubmit : handleConfirmSubmit}
              disabled={isMutatePending || isFinalizePending}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isMutatePending || isFinalizePending ? 'Đang xử lý...' : 'Xác nhận'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
