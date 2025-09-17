import type { AxiosError } from 'axios';
import type { Order } from '../schemas/order/order.schema';

import type { PaginationRequest, PaginationResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = {
  options?: PaginationRequest;
};
type Response = PaginationResponse<Order>;

export const useOrderGetAll = createQuery<Response, Variables, AxiosError>({
  queryKey: ['orders'],
  fetcher: (variables?: Variables) => {
    const searchParams = new URLSearchParams();

    if (variables?.options?.limit) {
      searchParams.set('limit', String(variables.options.limit));
    } else {
      searchParams.set('limit', '1000');
    }

    return apiClient
      .get(`orders?${searchParams}`)
      .then(response => response.data);
  },
});
