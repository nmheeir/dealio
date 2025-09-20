import type { AxiosError } from 'axios';
import type { Order } from '@/api/schemas/order/order.schema';

import type { PaginationResponse } from '@/api/types';
import { createQuery } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Response = PaginationResponse<Order>;
type Variables = void;

export const useOrderFindAll = createQuery<Response, Variables, AxiosError>({
  queryKey: ['orders/admin-manager/find-all'],
  fetcher: () => {
    return apiClient.get(`orders/admin-manager/find-all?limit=1000`).then(response => response.data);
  },
});
