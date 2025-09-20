import type { AxiosError } from 'axios';
import type { RefundRequest } from '../schemas/refund/refund-request.schema';

import type { PaginationResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = void;
type Response = PaginationResponse<RefundRequest>;

export const useRefundRequestGetAll = createQuery<Response, Variables, AxiosError>({
  queryKey: ['refunds/admin-manager'],
  fetcher: () => {
    return apiClient
      .get(`refunds/admin-manager`)
      .then(response => response.data);
  },
});
