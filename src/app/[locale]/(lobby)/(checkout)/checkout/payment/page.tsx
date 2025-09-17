/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use client';

import type { CartItem } from '@/api/schemas/cart/cart.schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useQueryState } from 'nuqs';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAddresses } from '@/api/address/use-addressed';
import apiClient from '@/api/common/client';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/libs/utils';
import { CartItemsTable } from '../_components/cart-item-table';
import { CartItemsCards } from '../_components/cart-items-cards';
import { CartSummary } from '../_components/cart-summary';

type Address = {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
};

export default function CheckoutPaymentPage() {
  const [type] = useQueryState('type');
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const isDigital = type === 'digital';

  // Fetch cart items
  const { data, isLoading, error } = useGetCarts({ cartType: isDigital ? 'DIGITAL' : 'PHYSICAL' });

  // Fetch addresses (for physical cart)
  const { data: addresses, isLoading: addressesLoading } = useAddresses();
  const addresses1 = addresses?.data.data ?? [];

  // Mutation to create order
  const createOrderMutation = useMutation({
    mutationFn: (payload: { cartType: 'DIGITAL' | 'PHYSICAL'; addressId?: string; paymentMethod?: 'COD' | 'ONLINE' }) => {
      // TODO: Implement API call to create order
      // Example: return apiClient.post('/orders', payload).then(res => res.data);
      return Promise.resolve({ paymentUrl: 'https://payment-gateway.com' }); // Placeholder
    },
    onSuccess: (data) => {
      if (isDigital || paymentMethod === 'ONLINE') {
        window.location.href = data.paymentUrl; // Redirect to payment gateway
      } else {
        toast.success('Đơn hàng của bạn đã được tạo');
        queryClient.invalidateQueries({ queryKey: ['carts'] });
      }
    },
    onError: (error: any) => {
      toast.error(error.message);
      setIsSubmitting(false);
    },
  });

  const handleCheckout = () => {
    if (isDigital) {
      setIsSubmitting(true);
      createOrderMutation.mutate({ cartType: 'DIGITAL' });
    } else if (paymentMethod && (!paymentMethod === 'COD' || selectedAddress)) {
      setIsSubmitting(true);
      createOrderMutation.mutate({ cartType: 'PHYSICAL', addressId: selectedAddress, paymentMethod });
    } else {
      toast({
        title: 'Lỗi',
        description: paymentMethod ? 'Vui lòng chọn địa chỉ giao hàng.' : 'Vui lòng chọn phương thức thanh toán.',
        variant: 'destructive',
      });
    }
  };

  const handleRetryPayment = () => {
    // TODO: Implement navigation to UC02-092 to retrieve payment link
    toast({
      title: 'Lấy lại link thanh toán',
      description: 'Chuyển hướng đến trang lấy lại link thanh toán.',
    });
  };

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (error || !data) {
    return (
      <div className="p-4 text-center text-red-500">
        {error?.message || 'Không thể tải giỏ hàng'}
        <Button variant="link" onClick={handleRetryPayment} className="mt-2">
          Thử lại
        </Button>
      </div>
    );
  }

  const items: CartItem[] = data.data.data;

  // Check for unavailable items
  const hasUnavailableItems = items.some(item => item.productStatus !== 'ACTIVE' || item.outOfStock);
  if (hasUnavailableItems) {
    return (
      <div className="p-4 text-center text-red-500">
        Một số sản phẩm không còn khả dụng. Vui lòng cập nhật giỏ hàng.
        <Button variant="link" onClick={() => window.location.href = '/cart'}>
          Quay lại giỏ hàng
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-4 text-2xl font-semibold">
        Thanh toán
        {' '}
        {isDigital ? 'Digital' : 'Vật lý'}
      </h1>
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
                  <Skeleton className="h-10 w-full" />
                )
              : (
                  <div className="grid grid-cols-2 gap-4">
                    {addresses1?.map(address => (
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
                  id: 'ONLINE',
                  label: 'Thanh toán trực tuyến',
                  description: 'Hỗ trợ thẻ, ví điện tử, chuyển khoản',
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
                  onClick={() => setPaymentMethod(method.id as 'COD' | 'ONLINE')}
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
                      'Thanh toán ngay'
                    )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function useGetCarts({ cartType }: { cartType: 'DIGITAL' | 'PHYSICAL' }) {
  return useQuery({
    queryKey: ['carts', cartType],
    queryFn: () => apiClient.get(`/carts?cartType=${cartType}`).then(res => res.data),
  });
}
