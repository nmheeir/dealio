import type { AxiosError } from 'axios';
import type { RefundRequest } from '../schemas/refund/refund-request.schema';

import type { ApiResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = {
  orderId: string;
};
type Response = ApiResponse<RefundRequest>;

export const useRefundFindByOrderId = createQuery<Response, Variables, AxiosError>({
  queryKey: ['refunds/order'],
  fetcher: (variables) => {
    return apiClient
      .get(`refunds/order/${variables.orderId}`)
      .then(response => response.data);
  },
});
