import type { AxiosError } from 'axios';
import type { ApiResponse } from '../../types';

import { createMutation } from 'react-query-kit';
import apiClient from '../../common/client';

type Variables = {
  orderId: string;
};
type Response = ApiResponse<any>;

export const useCancelOrder = createMutation<Response, Variables, AxiosError>({
  mutationFn: async variables =>
    apiClient({
      url: `orders/cancel-order/${variables.orderId}`,
      method: 'PUT',
    }).then(response => response.data),
});
