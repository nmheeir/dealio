import type { AxiosError } from 'axios';
import type { ApiResponse } from '../types';

import { createMutation } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = {
  refund_request_id: string;
  amount: string;
};
type Response = ApiResponse<any>;

export const useRefundFinalizeRequest = createMutation<Response, Variables, AxiosError>({
  mutationFn: async variables =>
    apiClient({
      url: 'refunds/admin/finalize',
      method: 'POST',
      data: variables,
    }).then(response => response.data),
});
