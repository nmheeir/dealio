import type { AxiosError } from 'axios';
import type { Order } from '@/api/schemas/order/order.schema';

import type { ApiResponse } from '@/api/types';
import { createMutation } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = {
  orderId: string;
};
type Response = ApiResponse<Order>;

export const useOrderConfirm = createMutation<Response, Variables, AxiosError>({
  mutationFn: async variables =>
    apiClient({
      url: `orders/admin-manager/confirm-order/${variables.orderId}`,
      method: 'PATCH',
    }).then(response => response.data),
});
