import type { AxiosError } from 'axios';
import type { ApiResponse } from '../../types';

import { createMutation } from 'react-query-kit';
import apiClient from '../../common/client';

type Variables = {
  orderId: string;
  addressId: string;
};
type Response = ApiResponse<any>;

export const useChangeOrderAddress = createMutation<Response, Variables, AxiosError>({
  mutationFn: async variables =>
    apiClient({
      url: `orders/change-address/${variables.orderId}`,
      method: 'PATCH',
      data: {
        addressId: variables.addressId,
      },
    }).then(response => response.data),
});
