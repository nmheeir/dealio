import type { RefundRequest } from '@/api/schemas/refund/refund-request.schema';
import { useState } from 'react';
import { toast } from 'sonner';
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
  const [actionType, setActionType] = useState<'APPROVED' | 'REJECTED' | null>(null);

  const { mutate: reviewRefundRequest, isPending } = useRefundRequestReview({
    onSuccess: () => {
      const statusMessage = actionType === 'APPROVED' ? 'phê duyệt' : 'từ chối';
      toast.success(`Yêu cầu hoàn tiền đã được ${statusMessage}`, {
        description: `Trạng thái yêu cầu đã được cập nhật thành ${actionType}.`,
      });
      setIsDialogOpen(false);
      setReviewNotes('');
    },
    onError: (error) => {
      toast.error('Đã xảy ra lỗi khi xử lý yêu cầu hoàn tiền.', {
        description: error.message,
      });
    },
  });

  const handleAction = (status: 'APPROVED' | 'REJECTED') => {
    if (item.status !== 'PENDING') {
      toast.error('Yêu cầu này đã được xử lý, không thể thay đổi.');
      return;
    }
    setActionType(status);
    if (status === 'REJECTED') {
      setIsDialogOpen(true);
    } else {
      reviewRefundRequest({
        refund_request_id: item.id,
        status: 'APPROVED',
        review_notes: '',
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

  return (
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
          e.preventDefault(); // ngăn dropdown đóng lại
          handleAction('REJECTED');
        }}
      >
        Từ chối
      </DropdownMenuItem>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lý do từ chối yêu cầu hoàn tiền</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Nhập lý do từ chối"
              value={reviewNotes}
              onChange={e => setReviewNotes(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleRejectSubmit} disabled={isPending}>
              {isPending ? 'Đang xử lý...' : 'Xác nhận'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
