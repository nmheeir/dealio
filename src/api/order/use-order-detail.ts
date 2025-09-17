import type { AxiosError } from 'axios';
import type { Order } from '../schemas/order/order.schema';

import type { ApiResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '../common/client';

type Variables = {
  orderId: string;
};
type Response = ApiResponse<Order>;

export const useGetOrderDetail = createQuery<Response, Variables, AxiosError>({
  queryKey: ['order'],
  fetcher: (variables) => {
    return apiClient
      .get(`order/${variables.orderId}`)
      .then(response => response.data);
  },
});
