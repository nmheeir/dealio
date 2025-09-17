import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/api/types';

import { createMutation } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = {
  productVariantId: string;
};
type Response = ApiResponse<any>;

export const useDigitalBuyNow = createMutation<Response, Variables, AxiosError>({
  mutationFn: async variables =>
    apiClient({
      url: 'orders/digital/buy-now',
      method: 'POST',
      data: variables,
    }).then(response => response.data),
});
