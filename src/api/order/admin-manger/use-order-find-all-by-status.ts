import type { AxiosError } from 'axios';
import type { OrderStatus } from '@/api/schemas/order/order-status.schema';

import type { Order } from '@/api/schemas/order/order.schema';
import type { PaginationResponse } from '@/api/types';
import { createQuery } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = {
  orderStatus: OrderStatus;
};
type Response = PaginationResponse<Order>;

export const useOrderFindAllByStatus = createQuery<Response, Variables, AxiosError>({
  queryKey: ['orders/admin-manager/find-by-status/'],
  fetcher: (variables) => {
    return apiClient
      .get(`orders/admin-manager/find-by-status//${variables.orderStatus}`)
      .then(response => response.data);
  },
});
