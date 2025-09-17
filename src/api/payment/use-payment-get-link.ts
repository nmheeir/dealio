import type { AxiosError } from 'axios';
import type { ApiResponse } from '../types';

import { createMutation } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = {
  orderId: string;
};
type Response = ApiResponse<any>;

export const usePaymentGetLinkByOrderId = createMutation<Response, Variables, AxiosError>({
  mutationFn: async ({ orderId }) => {
    return apiClient
      .get(`payments/payment-link?orderId=${orderId}`)
      .then(res => res.data);
  },
});
