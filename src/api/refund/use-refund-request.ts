import type { AxiosError } from 'axios';
import type { ApiResponse } from '../types';

import { createMutation } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = {
  orderId: string;
  reason: string;
};
type Response = ApiResponse<any>;

export const useRefundRequest = createMutation<Response, Variables, AxiosError>({
  mutationFn: async variables =>
    apiClient({
      url: 'refunds/request',
      method: 'POST',
      data: {
        order_id: variables.orderId,
        reason: variables.reason,
      },
    }).then(response => response.data),
});
