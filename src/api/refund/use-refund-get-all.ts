import type { AxiosError } from 'axios';
import type { RefundRequest } from '../schemas/refund/refund-request.schema';

import type { PaginationResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Response = PaginationResponse<RefundRequest>;
type Variables = void;

export const useRefundGetAll = createQuery<Response, Variables, AxiosError>({
  queryKey: ['refunds'],
  fetcher: () => {
    return apiClient.get(`refunds`).then(response => response.data);
  },
});
