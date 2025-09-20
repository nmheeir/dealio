import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/api/types';

import { createMutation } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = {
  orderId: string;
};
type Response = ApiResponse<any>;

export const useOrderAdminManagerCancel = createMutation<Response, Variables, AxiosError>({
  mutationFn: async variables =>
    apiClient({
      url: `orders/admin-manager/cancel/${variables.orderId}`,
      method: 'PUT',
    }).then(response => response.data),
});
