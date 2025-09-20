'use client';

import type { Refund } from '@/api/schemas/refund/refund.schema';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatCurrency, formatDate, orderStatusColor } from '../../../_components/utils';

type RefundDetailsDialogProps = {
  refund: Refund;
};

export default function RefundDetailsDialog({ refund }: RefundDetailsDialogProps) {
  const [open, setOpen] = useState(false);
  const order = refund.order;
  const isMobile = useIsMobile();

  return (
    <>
      {/* Trigger từ DropdownMenuItem */}
      <DropdownMenuItem
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        Xem chi tiết
      </DropdownMenuItem>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={`max-h-[80vh] min-w-0 overflow-y-auto ${
            isMobile ? 'max-w-[100vw] p-3' : 'max-w-[800px] p-6'
          }`}
        >
          <DialogHeader>
            <DialogTitle className={isMobile ? 'text-lg font-bold' : 'text-2xl font-bold'}>
              Chi tiết yêu cầu hoàn tiền
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Thông tin yêu cầu hoàn tiền */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className={isMobile ? 'text-base font-semibold' : 'text-lg font-semibold'}>
                  Thông tin yêu cầu
                </CardTitle>
              </CardHeader>
              <CardContent
                className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-3 overflow-hidden`}
              >
                <div>
                  <p className="text-xs text-muted-foreground">Mã yêu cầu</p>
                  <p className="text-xs font-medium break-all">{refund.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Trạng thái</p>
                  <Badge className="rounded-full px-1.5 py-0 text-[10px]">
                    {refund.status}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Lý do hoàn tiền</p>
                  <p className="text-xs font-medium break-words">{refund.reason ?? '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ngày tạo</p>
                  <p className="text-xs font-medium">{formatDate(refund.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ngày cập nhật</p>
                  <p className="text-xs font-medium">{formatDate(refund.updatedAt)}</p>
                </div>
                {refund.reviewedAt && (
                  <div>
                    <p className="text-xs text-muted-foreground">Ngày phê duyệt/từ chối</p>
                    <p className="text-xs font-medium">{formatDate(refund.reviewedAt)}</p>
                  </div>
                )}
                {refund.reviewNotes && (
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Ghi chú phê duyệt/từ chối</p>
                    <p className="text-xs font-medium break-words">{refund.reviewNotes}</p>
                  </div>
                )}
                {refund.finalizedAt && (
                  <div>
                    <p className="text-xs text-muted-foreground">Ngày hoàn tất</p>
                    <p className="text-xs font-medium">{formatDate(refund.finalizedAt)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Thông tin đơn hàng liên quan */}
            {order && (
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className={isMobile ? 'text-base font-semibold' : 'text-lg font-semibold'}>
                    Thông tin đơn hàng liên quan
                  </CardTitle>
                </CardHeader>
                <CardContent
                  className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-3 overflow-hidden`}
                >
                  <div>
                    <p className="text-xs text-muted-foreground">Mã đơn hàng</p>
                    <p className="text-xs font-medium">{order.order_code ?? '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Trạng thái đơn hàng</p>
                    <Badge
                      className={`${orderStatusColor[order.status]} rounded-full px-1.5 py-0 text-[10px]`}
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Loại đơn</p>
                    <p className="text-xs font-medium">{order.order_type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phương thức thanh toán</p>
                    <p className="text-xs font-medium">{order.payment_method}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Tổng tiền hoàn (tổng đơn hàng)</p>
                    <p className={isMobile ? 'text-sm font-bold' : 'text-lg font-bold'}>
                      {formatCurrency(order.total_amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Tạm tính</p>
                    <p className="text-xs font-medium">{formatCurrency(order.sub_total)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Giảm giá</p>
                    <p className="text-xs font-medium">{formatCurrency(order.discount_amount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phí vận chuyển</p>
                    <p className="text-xs font-medium">{formatCurrency(order.shipping_fee)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Ngày tạo đơn</p>
                    <p className="text-xs font-medium">{formatDate(order.createdAt)}</p>
                  </div>
                  {order.completed_at && (
                    <div>
                      <p className="text-xs text-muted-foreground">Ngày hoàn tất đơn</p>
                      <p className="text-xs font-medium">{formatDate(order.completed_at)}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
