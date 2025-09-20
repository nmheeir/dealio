import type { AxiosError } from 'axios';
import type { Refund } from '../schemas/refund/refund.schema';

import type { ApiResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = {
  orderId: string;
};
type Response = ApiResponse<Refund>;

export const useRefundFindByOrderId = createQuery<Response, Variables, AxiosError>({
  queryKey: ['refunds/order'],
  fetcher: (variables) => {
    return apiClient
      .get(`refunds/order/${variables.orderId}`)
      .then(response => response.data);
  },
});
