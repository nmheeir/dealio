'use client';

import type { Order } from '@/api/schemas/order/order.schema';
import { AlertCircle, CircleCheck, CircleX, Package, ShoppingCart, Truck } from 'lucide-react';
import { useState } from 'react';
import { useGetOrderDetail } from '@/api/order/use-order-detail';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

export function ViewOrderDetail({ item }: { item: Order }) {
  const { data, isLoading, error, refetch } = useGetOrderDetail({
    variables: {
      orderId: item.id,
    },
  });
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  if (isLoading) {
    return <OrderDetailSkeleton />;
  }

  if (error || !data) {
    return (
      <OrderDetailError
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  const order = data.data;

  // Format tiền tệ
  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(Number(amount));
  };

  // Stepper trạng thái
  const steps = [
    { status: 'pending', label: 'Đặt hàng', icon: <ShoppingCart className="h-5 w-5" /> },
    { status: 'confirmed', label: 'Xác nhận', icon: <CircleCheck className="h-5 w-5" /> },
    { status: 'shipping', label: 'Đang giao', icon: <Truck className="h-5 w-5" /> },
    { status: 'completed', label: 'Hoàn thành', icon: <Package className="h-5 w-5" /> },
  ];

  const currentStep = item.cancelled_at
    ? -1
    : steps.findIndex(step => step.status === item.status) + 1;

  const detailContent = (
    <div className="space-y-6">
      {/* Order Code */}
      {order.order_code && (
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold">Mã đơn hàng:</span>
          {' '}
          {order.order_code}
        </div>
      )}

      {/* Stepper */}
      <div className="relative">
        {/* Thanh ngang */}
        <div className="absolute top-4 right-0 left-0 z-0 h-1 bg-gray-200">
          <div
            className={`h-1 ${
              order.cancelled_at ? 'bg-red-500' : 'bg-green-500'
            } transition-all duration-500`}
            style={{
              width: order.cancelled_at
                ? '100%'
                : `${(currentStep / steps.length) * 100}%`,
            }}
          />
        </div>

        {/* Step icons */}
        <div className="relative z-10 flex items-center justify-between">
          {steps.map((step, index) => (
            <div
              key={step.status}
              className="flex flex-col items-center text-center"
            >
              <div
                className={`rounded-full p-2 ${
                  currentStep > index + 1
                  || (order.cancelled_at && step.status === 'completed')
                    ? 'bg-green-100 text-green-600'
                    : order.cancelled_at
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 text-gray-600'
                }`}
              >
                {order.cancelled_at && step.status === 'completed'
                  ? (
                      <CircleX className="h-5 w-5" />
                    )
                  : (
                      step.icon
                    )}
              </div>
              <span className="mt-2 text-xs">
                {order.cancelled_at && step.status === 'completed'
                  ? 'Đã hủy'
                  : step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Layout chính */}
      <div className={isMobile ? 'space-y-6' : 'grid grid-cols-3 gap-6'}>
        {/* Thông tin chính (người nhận, địa chỉ, chi phí, thời gian) */}
        <div className={isMobile ? '' : 'col-span-2 space-y-6'}>
          {/* Thông tin người nhận & địa chỉ */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-semibold">Thông tin người nhận</h3>
              <p className="text-sm">
                <span className="font-medium">Tên:</span>
                {' '}
                {order.orderAddress?.to_name}
              </p>
              <p className="text-sm">
                <span className="font-medium">SĐT:</span>
                {' '}
                {order.orderAddress?.to_phone}
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold">Địa chỉ giao hàng</h3>
              <p className="text-sm">{order.orderAddress?.to_address}</p>
              <p className="text-sm">
                {order.orderAddress?.to_ward_code}
                ,
                {order.orderAddress?.to_district_id}
                ,
                {' '}
                {order.orderAddress?.to_province_name}
              </p>
            </div>
          </div>

          {/* Chi phí */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium">Tổng phụ</p>
              <p className="text-sm">{formatCurrency(order.sub_total)}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Giảm giá</p>
              <p className="text-sm">{formatCurrency(order.discount_amount)}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Phí vận chuyển</p>
              <p className="text-sm">{formatCurrency(order.shipping_fee)}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Tổng cộng</p>
              <p className="text-lg font-semibold text-primary">{formatCurrency(order.total_amount)}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Phương thức thanh toán</p>
              <p className="text-sm">{order.payment_method}</p>
            </div>
          </div>

          {/* Thời gian */}
          <Separator />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium">Ngày tạo</p>
              <p className="text-sm">
                {new Date(order.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Cập nhật lần cuối</p>
              <p className="text-sm">
                {new Date(order.updatedAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
            {order.completed_at && (
              <div>
                <p className="text-sm font-medium">Hoàn thành</p>
                <p className="text-sm">
                  {new Date(order.completed_at).toLocaleDateString('vi-VN')}
                </p>
              </div>
            )}
            {order.cancelled_at && (
              <div>
                <p className="text-sm font-medium">Hủy bỏ</p>
                <p className="text-sm">
                  {new Date(order.cancelled_at).toLocaleDateString('vi-VN')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        {order.orderItems && order.orderItems.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-semibold">Sản phẩm</h3>
            {isMobile
              ? (
                  <ScrollArea className="h-[300px] rounded-md border p-4">
                    <div className="space-y-4">
                      {order.orderItems.map(orderItem => (
                        <div
                          key={orderItem.id}
                          className="flex items-center justify-between border-b pb-2"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {orderItem.productVariant.variant_name || 'Sản phẩm không xác định'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Số lượng:
                              {' '}
                              {orderItem.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">{formatCurrency(orderItem.price)}</p>
                            <p className="text-sm text-muted-foreground">
                              Tổng:
                              {' '}
                              {formatCurrency(Number(orderItem.price) * orderItem.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )
              : (
                  <div className="rounded-md border p-4">
                    <div className="space-y-4">
                      {order.orderItems.map(orderItem => (
                        <div
                          key={orderItem.id}
                          className="flex items-center justify-between border-b pb-2"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {orderItem.productVariant.variant_name || 'Sản phẩm không xác định'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Số lượng:
                              {' '}
                              {orderItem.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">{formatCurrency(orderItem.price)}</p>
                            <p className="text-sm text-muted-foreground">
                              Tổng:
                              {' '}
                              {formatCurrency(Number(orderItem.price) * orderItem.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <DropdownMenuItem
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        Xem chi tiết
      </DropdownMenuItem>

      {isMobile
        ? (
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerContent className="max-h-[80vh]">
                <DrawerHeader>
                  <DrawerTitle>
                    Chi tiết đơn hàng #
                    {order.id}
                  </DrawerTitle>
                </DrawerHeader>
                <div className="overflow-y-auto p-4">{detailContent}</div>
              </DrawerContent>
            </Drawer>
          )
        : (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent className="min-w-4xl">
                <DialogHeader>
                  <DialogTitle>
                    Chi tiết đơn hàng #
                    {order.id}
                  </DialogTitle>
                </DialogHeader>
                {detailContent}
              </DialogContent>
            </Dialog>
          )}
    </>
  );
}

function OrderDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Order Code */}
      <Skeleton className="h-4 w-40" />

      {/* Stepper */}
      <div className="flex items-center justify-between">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="mt-2 h-3 w-12" />
          </div>
        ))}
      </div>

      {/* Layout chính */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Thông tin chính */}
        <div className="space-y-6 md:col-span-2">
          {/* Thông tin người nhận & địa chỉ */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>

          {/* Chi phí */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>

          {/* Thời gian */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-32" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b pb-2"
            >
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="space-y-2 text-right">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OrderDetailError({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry?: () => void;
}) {
  const message
    = error instanceof Error
      ? error.message
      : 'Không thể tải chi tiết đơn hàng. Vui lòng thử lại.';

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader className="flex flex-row items-center space-x-2">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <CardTitle className="text-red-600">Lỗi tải dữ liệu</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-red-600">{message}</p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Thử lại
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
