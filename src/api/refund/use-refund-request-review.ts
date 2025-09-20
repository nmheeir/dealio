import type { AxiosError } from 'axios';

import type { ApiResponse } from '../types';
import { createMutation } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = {
  refund_request_id: string;
  status: 'REJECTED' | 'APPROVED';
  review_notes: string;
};
type Response = ApiResponse<any>;

export const useRefundRequestReview = createMutation<Response, Variables, AxiosError>({
  mutationFn: async variables =>
    apiClient({
      url: 'refunds/admin-manager/reviewed',
      method: 'PATCH',
      data: variables,
    }).then(response => response.data),
});
