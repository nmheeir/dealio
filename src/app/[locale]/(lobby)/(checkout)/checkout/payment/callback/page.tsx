// pages/checkout-payment-callback.tsx
'use client';

import type { AxiosError } from 'axios';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { usePaymentReturnUrlMomo } from '@/api/payment/use-payment-return-momo-url';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Status = 'idle' | 'loading' | 'success' | 'failure';

export default function CheckoutPaymentCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { mutate: confirmMomoPayment } = usePaymentReturnUrlMomo();
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    if (!searchParams.get('orderId')) {
      return;
    }

    setStatus('loading');

    const params = Object.fromEntries(searchParams.entries());
    const momoData = {
      partnerCode: params.partnerCode || '',
      orderId: params.orderId || '',
      requestId: params.requestId || '',
      amount: Number(params.amount || 0),
      orderInfo: params.orderInfo || '',
      orderType: params.orderType || '',
      transId: params.transId || '',
      resultCode: Number(params.resultCode || -1),
      message: params.message || '',
      payType: params.payType || '',
      responseTime: Number(params.responseTime || 0),
      extraData: params.extraData || '',
      signature: params.signature || '',
    };

    confirmMomoPayment(momoData, {
      onSuccess: (res) => {
        if (res?.statusCode === 201) {
          toast.success('Thanh toán thành công 🎉');
          setStatus('success');
        } else {
          toast.error('Thanh toán thất bại hoặc bị hủy.');
          setStatus('failure');
        }
      },
      onError: (err: AxiosError<any>) => {
        console.error('Lỗi xác thực thanh toán MoMo:', err);
        toast.error(
          err.response?.data?.message || 'Không thể xác thực kết quả thanh toán.',
        );
        setStatus('failure');
      },
    });
  }, [searchParams, confirmMomoPayment]);

  if (status === 'loading') {
    return <PaymentLoading />;
  }
  if (status === 'success') {
    return <PaymentSuccess onGoHome={() => router.push('/')} />;
  }
  if (status === 'failure') {
    return <PaymentFailure onRetry={() => router.push('/checkout')} />;
  }

  return null;
}

function PaymentLoading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-[400px] text-center shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2 text-lg">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            Đang xử lý thanh toán...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Vui lòng đợi trong giây lát.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function PaymentSuccess({ onGoHome }: { onGoHome: () => void }) {
  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-[400px] text-center shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2 text-lg text-green-600">
            <CheckCircle className="h-6 w-6" />
            Thanh toán thành công 🎉
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được thanh toán thành
            công.
          </p>
          <Button onClick={onGoHome} className="w-full">
            Về trang chủ
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function PaymentFailure({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-[400px] text-center shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2 text-lg text-red-600">
            <XCircle className="h-6 w-6" />
            Thanh toán thất bại ❌
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc chọn
            phương thức khác.
          </p>
          <Button variant="destructive" onClick={onRetry} className="w-full">
            Thử lại
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
