import type { AxiosError } from 'axios';

import type { ApiResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = {
  orderId: string;
};
type Response = ApiResponse<any>;

export const usePaymentGetMomoStatus = createQuery<Response, Variables, AxiosError>({
  queryKey: ['payments/momo/status'],
  fetcher: (variables) => {
    return apiClient
      .get(`payments/momo/status?orderId=${variables.orderId}`)
      .then(response => response.data);
  },
});
