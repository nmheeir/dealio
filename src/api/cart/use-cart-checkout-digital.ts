import type { AxiosError } from 'axios';
import type { ApiResponse } from '../types';

import { createMutation } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = void;
type Response = ApiResponse<any>;

export const useCartCheckoutDigital = createMutation<Response, Variables, AxiosError>({
  mutationFn: async () =>
    apiClient({
      url: 'carts/checkout-digital',
    }).then(response => response.data),
});
