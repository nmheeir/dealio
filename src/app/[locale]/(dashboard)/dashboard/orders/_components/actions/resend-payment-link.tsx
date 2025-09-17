// components/order/ResendPaymentLink.tsx
'use client';

import type { Order } from '@/api/schemas/order/order.schema';
import { Copy, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { usePaymentGetLinkByOrderId } from '@/api/payment/use-payment-get-link';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// UC02-091: Lấy lại link thanh toán
export function ResendPaymentLink({ item }: { item: Order }) {
  const { mutate: getPaymentLink, isPending } = usePaymentGetLinkByOrderId();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [links, setLinks] = useState<{ payUrl: string; shortLink: string } | null>(null);

  // Ẩn item nếu đơn hàng không ở trạng thái PENDING_PAYMENT
  if (item.status !== 'PENDING_PAYMENT') {
    return null;
  }

  const handleResendPaymentLink = () => {
    getPaymentLink(
      { orderId: item.id },
      {
        onSuccess: (res) => {
          // Lưu link và mở modal để hiển thị
          setLinks({ payUrl: res.data.payUrl, shortLink: res.data.shortLink });
          setIsModalOpen(true);
        },
        onError: (err) => {
          console.error('Lỗi lấy link thanh toán:', err);
          // Xử lý các trường hợp lỗi theo use case
          const errorMessage
            = err.response?.data?.message || 'Đã xảy ra lỗi khi lấy link thanh toán.';
          if (errorMessage.includes('hết hạn')) {
            toast.error('Link thanh toán đã hết hạn, vui lòng tạo đơn hàng mới.');
          } else if (errorMessage.includes('không hợp lệ')) {
            toast.error('Đơn hàng này không thể tiếp tục thanh toán.');
          } else {
            toast.error(errorMessage);
          }
        },
      },
    );
  };

  // Hàm sao chép link vào clipboard
  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success('Đã sao chép link vào clipboard!');
  };

  return (
    <>
      <DropdownMenuItem
        onClick={(e) => {
          e.preventDefault();
          handleResendPaymentLink();
        }}
        className="cursor-pointer"
        disabled={isPending}
      >
        <CreditCard className="mr-2 h-4 w-4" />
        {isPending ? 'Đang lấy link...' : 'Lấy lại link thanh toán'}
      </DropdownMenuItem>

      {/* Modal hiển thị link thanh toán */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link thanh toán</DialogTitle>
            <DialogDescription>
              Vui lòng chọn một trong hai link dưới đây để tiếp tục thanh toán đơn hàng
              {' '}
              {item.id}
              .
            </DialogDescription>
          </DialogHeader>
          {links && (
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium">Link đầy đủ (payUrl)</Label>
                <div className="mt-1 flex items-center">
                  <Input value={links.payUrl} readOnly className="flex-1" />
                  <Button
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    onClick={() => handleCopyLink(links.payUrl)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <a
                  href={links.payUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-blue-600 hover:underline"
                >
                  Mở link thanh toán
                </a>
              </div>
              <div>
                <Label className="block text-sm font-medium">Link ngắn (shortLink)</Label>
                <div className="mt-1 flex items-center">
                  <Input value={links.shortLink} readOnly className="flex-1" />
                  <Button
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    onClick={() => handleCopyLink(links.shortLink)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <a
                  href={links.shortLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-blue-600 hover:underline"
                >
                  Mở link thanh toán
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
