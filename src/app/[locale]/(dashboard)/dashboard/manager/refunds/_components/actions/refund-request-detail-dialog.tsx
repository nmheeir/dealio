import type { RefundRequest } from '@/api/schemas/refund/refund-request.schema';
// --- refund-request-detail-dialog.tsx ---
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatDate } from '@/libs/utils';

const refundStatusColor: Record<RefundRequest['status'], string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
};

type Props = {
  item: RefundRequest;
};

export default function RefundRequestDetailDialog({ item }: Props) {
  const [open, setOpen] = useState(false);

  const formatCurrency = (value?: string | number) => {
    if (!value) {
      return '-';
    }
    return `${new Intl.NumberFormat('vi-VN').format(Number(value))} VND`;
  };

  return (
    <>
      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={() => setOpen(true)}
      >
        Xem chi tiết
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết yêu cầu hoàn tiền</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Thông tin chung */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Thông tin chung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <strong>Lý do:</strong>
                  {' '}
                  {item.reason}
                </div>
                <div className="flex items-center gap-2">
                  <strong>Trạng thái:</strong>
                  <Badge
                    className={`${refundStatusColor[item.status]} rounded-full px-2 py-0.5`}
                  >
                    {item.status}
                  </Badge>
                </div>
                <div>
                  <strong>Số tiền đơn hàng:</strong>
                  {' '}
                  {formatCurrency(item.order?.total_amount)}
                </div>
              </CardContent>
            </Card>

            {/* Thông tin duyệt */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Thông tin duyệt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <strong>Ngày duyệt:</strong>
                  {' '}
                  {item.reviewedAt ? formatDate(item.reviewedAt) : '-'}
                </div>
                <div>
                  <strong>Người duyệt:</strong>
                  {' '}
                  {item.reviewedBy?.email ?? '-'}
                </div>
              </CardContent>
            </Card>

            {/* Thông tin hoàn tất */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Thông tin hoàn tất</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <strong>Ngày hoàn tất:</strong>
                  {' '}
                  {item.finalizedAt ? formatDate(item.finalizedAt) : '-'}
                </div>
                <div>
                  <strong>Người finalize:</strong>
                  {' '}
                  {item.finalizedBy?.email ?? '-'}
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
