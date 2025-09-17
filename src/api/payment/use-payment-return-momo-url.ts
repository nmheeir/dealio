// api/payment/use-payment-return-momo-url.ts
import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';
import apiClient from '@/api/common/client';

// Định nghĩa kiểu dữ liệu chính xác cho các trường MoMo
type MomoFields = {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  orderInfo: string;
  orderType: string;
  transId: string;
  resultCode: number;
  message: string;
  payType: string;
  responseTime: number;
  extraData: string;
  signature: string;
};

type Response = {
  statusCode: number;
  message: string;
  data?: {
    orderId: string;
    paymentStatus: 'PAID' | 'FAILED' | 'CANCELED';
  };
};

export const usePaymentReturnUrlMomo = createMutation<Response, MomoFields, AxiosError>({
  mutationFn: async variables =>
    apiClient({
      url: 'payments/momo/return-url',
      method: 'POST',
      data: variables,
    }).then(response => response.data),
});
