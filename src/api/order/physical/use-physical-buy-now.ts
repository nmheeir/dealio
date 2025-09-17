import type { AxiosError } from 'axios';

import type { ApiResponse } from '../../types';
import { createMutation } from 'react-query-kit';
import apiClient from '../../common/client';

type Variables = {
  productVariantId: string;
  quantity: 2;
  addressId: string;
  paymentMethod: string;
};
type Response = ApiResponse<any>;

export const useBuyNowPhysical = createMutation<Response, Variables, AxiosError>({
  mutationFn: async variables =>
    apiClient({
      url: 'orders/physical/buy-now',
      method: 'POST',
      data: variables,
    }).then(response => response.data),
});
