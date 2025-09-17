import type { AxiosError } from 'axios';
import type { Order } from '@/api/schemas/order/order.schema';

import type { ApiResponse } from '@/api/types';
import { createQuery } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = {
  orderId: string;
};
type Response = ApiResponse<Order>;

export const useOrderShip = createQuery<Response, Variables, AxiosError>({
  queryKey: ['orders/admin-manager/ship-order'],
  fetcher: (variables) => {
    return apiClient
      .get(`orders/admin-manager/ship-order/${variables.orderId}`)
      .then(response => response.data);
  },
});
