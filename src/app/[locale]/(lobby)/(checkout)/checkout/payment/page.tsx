/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use client';

import type { CartItem } from '@/api/schemas/cart/cart.schema';
import { useQueryClient } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAddresses } from '@/api/address/use-addressed';
import { useCartCheckoutDigital } from '@/api/cart/use-cart-checkout-digital';
import { useCartCheckoutPhysical } from '@/api/cart/use-cart-checkout-physical';
import { useGetCarts } from '@/api/cart/use-get-cart';
import { usePaymentGetLinkByOrderId } from '@/api/payment/use-payment-get-link';
import { AlertCard } from '@/components/alert-card';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/libs/utils';
import { CartItemsTable } from '../_components/cart-item-table';
import { CartItemsCards } from '../_components/cart-items-cards';
import { CartSummary } from '../_components/cart-summary';

export default function CheckoutPaymentPage() {
  const [type] = useQueryState('type');
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'MOMO_WALLET' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { mutateAsync: paymentGetLink } = usePaymentGetLinkByOrderId();

  const isDigital = type === 'digital';

  // Fetch cart items
  const { data, isLoading, error } = useGetCarts({
    variables: {
      cartType: isDigital ? 'DIGITAL' : 'PHYSICAL',
    },
  });

  // Fetch addresses (for physical cart)
  const { data: addresses, isLoading: addressesLoading, error: addressesError } = useAddresses();
  const addresses1 = addresses?.data.data ?? [];

  // Mutations
  const { mutateAsync: digitalCheckout } = useCartCheckoutDigital();
  const physicalCheckout = useCartCheckoutPhysical();

  const handleCheckout = () => {
    setConfirmDialogOpen(true); // Mở dialog xác nhận
  };

  const confirmCheckout = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);

    if (isDigital) {
      await digitalCheckout(undefined, {
        onSuccess: async (res) => {
          if (res?.statusCode === 201 && res?.data?.id) {
            const orderId = res.data.id;
            await new Promise(resolve => setTimeout(resolve, 500));
            paymentGetLink(
              { orderId },
              {
                onSuccess: (payRes) => {
                  if (payRes?.data?.payUrl) {
                    window.open(payRes.data.payUrl, '_blank');
                    toast.success('Chuyển đến cổng thanh toán...');
                  } else {
                    toast.error('Không lấy được link thanh toán.');
                  }
                  queryClient.invalidateQueries({ queryKey: ['orders'] });
                },
                onError: (err: any) => {
                  const msg = (err.response?.data as any)?.message || 'Lấy link thanh toán thất bại.';
                  toast.error(msg);
                },
                onSettled: () => setIsSubmitting(false),
              },
            );
          } else {
            toast.error(res?.message || 'Không thể tạo đơn cho sản phẩm digital.');
            setIsSubmitting(false);
          }
        },
        onError: (error: any) => {
          setErrorMessage(error.response?.data?.message || 'Không thể tạo đơn hàng.');
        },
        onSettled: () => {
          setIsSubmitting(false);
          setConfirmDialogOpen(false);
        },
      });
    } else if (paymentMethod && (paymentMethod === 'MOMO_WALLET' || selectedAddress)) {
      physicalCheckout.mutate(
        { addressId: selectedAddress!, paymentMethod },
        {
          onSuccess: (response) => {
            if (response.statusCode === 201) {
              setSuccessDialogOpen(true);
              toast.success('Tạo đơn hàng thành công');
              queryClient.invalidateQueries({ queryKey: ['carts'] });
            } else {
              toast.error(response.message || 'Không thể tạo đơn hàng.');
              setErrorMessage(response.message || 'Không thể tạo đơn hàng.');
            }
          },
          onError: (error: any) => {
            setErrorMessage(error.response?.data?.message || 'Không thể tạo đơn hàng.');
          },
          onSettled: () => {
            setIsSubmitting(false);
            setConfirmDialogOpen(false);
          },
        },
      );
    } else {
      setErrorMessage(
        paymentMethod ? 'Vui lòng chọn địa chỉ giao hàng.' : 'Vui lòng chọn phương thức thanh toán.',
      );
      setIsSubmitting(false);
      setConfirmDialogOpen(false);
    }
  };

  const handleRetryPayment = () => {
    // TODO: Implement navigation to UC02-092 to retrieve payment link
    setErrorMessage('Chuyển hướng đến trang lấy lại link thanh toán.');
  };

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (error || !data) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="flex flex-row items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <CardTitle className="text-red-600">Lỗi tải dữ liệu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-red-600">{error?.message || 'Không thể tải giỏ hàng'}</p>
          <Button variant="link" onClick={handleRetryPayment}>
            Thử lại
          </Button>
        </CardContent>
      </Card>
    );
  }

  const items: CartItem[] = data.data.data;

  // Kiểm tra nếu giỏ hàng trống
  if (items.length === 0) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="mb-4 text-2xl font-semibold">
          Thanh toán
          {' '}
          {isDigital ? 'Digital' : 'Vật lý'}
        </h1>
        <AlertCard
          className="border-yellow-200 bg-yellow-50"
          title="Giỏ hàng trống"
          description="Giỏ hàng của bạn hiện không có sản phẩm. Vui lòng thêm sản phẩm để tiếp tục."
          icon="shoppingCart"
        />
      </div>
    );
  }

  if (items.some(item => item.productStatus !== 'ACTIVE')) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="flex flex-row items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <CardTitle className="text-red-600">Sản phẩm không khả dụng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-red-600">
            Một số sản phẩm không còn khả dụng. Vui lòng cập nhật giỏ hàng.
          </p>
          <Button variant="link" onClick={() => window.location.href = '/cart'}>
            Quay lại giỏ hàng
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-4 text-2xl font-semibold">
        Thanh toán
        {' '}
        {isDigital ? 'Digital' : 'Vật lý'}
      </h1>
      {errorMessage && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardHeader className="flex flex-row items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <CardTitle className="text-red-600">Lỗi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600">{errorMessage}</p>
          </CardContent>
        </Card>
      )}
      <div className="grid gap-6">
        {/* Cart Items */}
        <div className="hidden md:block">
          <CartItemsTable
            items={items}
            onUpdateQuantity={() => {}} // Disabled for checkout
            onRemove={() => {}} // Disabled for checkout
            isDigital={isDigital}
            isPayment={true}
          />
        </div>
        <div className="block md:hidden">
          <CartItemsCards
            items={items}
            onUpdateQuantity={() => {}} // Disabled for checkout
            onRemove={() => {}} // Disabled for checkout
            isDigital={isDigital}
            isPayment={true}
          />
        </div>

        {/* Address Selection (Physical Only) */}
        {!isDigital && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Địa chỉ giao hàng</h2>
            {addressesLoading
              ? (
                  <div className="grid grid-cols-2 gap-4">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                )
              : addressesError
                ? (
                    <Card className="border-red-200 bg-red-50">
                      <CardHeader className="flex flex-row items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <CardTitle className="text-red-600">Lỗi tải địa chỉ</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-red-600">
                          {addressesError.message || 'Không thể tải danh sách địa chỉ.'}
                        </p>
                      </CardContent>
                    </Card>
                  )
                : addresses1.length === 0
                  ? (
                      <Card className="border-yellow-200 bg-yellow-50">
                        <CardHeader className="flex flex-row items-center space-x-2">
                          <AlertCircle className="h-5 w-5 text-yellow-600" />
                          <CardTitle className="text-yellow-600">Chưa có địa chỉ</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-yellow-600">
                            Vui lòng thêm địa chỉ giao hàng trong Tài khoản.
                          </p>
                        </CardContent>
                      </Card>
                    )
                  : (
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {addresses1.map(address => (
                          <div
                            key={address.id}
                            className={cn(
                              'flex flex-col justify-between rounded-md border p-4 cursor-pointer',
                              selectedAddress === address.id
                                ? 'border-primary bg-primary/10'
                                : 'border-border',
                            )}
                            onClick={() => setSelectedAddress(address.id)}
                          >
                            <div className="flex-1">
                              <p className="font-medium">{address.to_name}</p>
                              <p className="text-sm text-muted-foreground">{address.to_phone}</p>
                              <p className="text-sm text-muted-foreground">
                                {address.to_address}
                                ,
                                {address.to_province_name}
                              </p>
                            </div>
                            <div className="mt-3 flex justify-end">
                              <Button
                                variant={selectedAddress === address.id ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedAddress(address.id)}
                              >
                                {selectedAddress === address.id ? 'Đã chọn' : 'Chọn'}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
          </div>
        )}

        {/* Payment Method (Physical Only) */}
        {!isDigital && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Phương thức thanh toán</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                {
                  id: 'COD',
                  label: 'Thanh toán khi nhận hàng (COD)',
                  description: 'Trả tiền mặt trực tiếp cho nhân viên giao hàng',
                },
                {
                  id: 'MOMO_WALLET',
                  label: 'Thanh toán qua MoMo',
                  description: 'Hỗ trợ thanh toán bằng ví MoMo',
                },
              ].map(method => (
                <div
                  key={method.id}
                  className={cn(
                    'flex cursor-pointer flex-col rounded-lg border p-4 transition hover:border-primary',
                    paymentMethod === method.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-background',
                  )}
                  onClick={() => setPaymentMethod(method.id as 'COD' | 'MOMO_WALLET')}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{method.label}</span>
                    {paymentMethod === method.id && (
                      <Icons.check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{method.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        <CartSummary
          activeTab={isDigital ? 'digital' : 'physical'}
          digitalItems={isDigital ? items : []}
          physicalItems={isDigital ? [] : items}
          isPayment={true}
        />

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/checkout'}
          >
            Quay lại giỏ hàng
          </Button>
          <Button
            onClick={handleCheckout}
            disabled={isSubmitting || (!isDigital && (!paymentMethod || (paymentMethod === 'COD' && !selectedAddress)))}
          >
            {isSubmitting
              ? (
                  <>
                    <Icons.loaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                )
              : isDigital
                ? (
                    'Thanh toán ngay'
                  )
                : paymentMethod === 'COD'
                  ? (
                      'Xác nhận COD'
                    )
                  : (
                      'Thanh toán qua MoMo'
                    )}
          </Button>
        </div>

        {/* Confirm Dialog */}
        <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận thanh toán</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Bạn có chắc chắn muốn
              {' '}
              {isDigital ? 'thanh toán ngay' : 'xác nhận đơn hàng'}
              ?
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={confirmCheckout} disabled={isSubmitting}>
                Xác nhận
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Success Dialog */}
        <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Đơn hàng đã được tạo thành công</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Cảm ơn bạn đã đặt hàng. Bạn có thể quay về trang chủ để tiếp tục mua sắm.
            </p>
            <DialogFooter>
              <Button onClick={() => window.location.href = '/'}>
                Về trang chủ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
