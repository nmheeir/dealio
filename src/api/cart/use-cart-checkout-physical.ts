import type { AxiosError } from 'axios';
import type { ApiResponse } from '../types';

import { createMutation } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = {
  addressId: string;
  paymentMethod: 'MOMO_WALLET' | 'COD';
};
type Response = ApiResponse<any>;

export const useCartCheckoutPhysical = createMutation<Response, Variables, AxiosError>({
  mutationFn: async variables =>
    apiClient({
      url: 'carts/checkout-physical',
      method: 'POST',
      data: {
        addressId: variables.addressId,
        paymentMethod: variables.paymentMethod,
      },
    }).then(response => response.data),
});
