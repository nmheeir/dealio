import type { AxiosError } from 'axios';
import type { ApiResponse } from '../types';

import { createQuery } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = {
  orderId: string;
};
type Response = ApiResponse<any>;

export const usePaymentGetLinkByOrderId = createQuery<Response, Variables, AxiosError>({
  queryKey: ['payments/payment-link'],
  fetcher: (variables) => {
    return apiClient
      .get(`payments/payment-link?orderId=${variables.orderId}`)
      .then(response => response.data);
  },
});
