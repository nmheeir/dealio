import type { AxiosError } from 'axios';
import type { ProductVariant } from '../schemas/product/product-variant.schema';

import type { ApiResponse } from '../types';
import { createMutation } from 'react-query-kit';
import apiClient from '../common/client';

type Variables = {
  id: string;
  quantity: number;
};
type Response = ApiResponse<ProductVariant>;

export const useUpdateStock = createMutation<Response, Variables, AxiosError>({
  mutationFn: async variables =>
    apiClient({
      url: `/product-variants/${variables.id}/physical/stock`,
      method: 'PATCH',
      data: {
        quantity: variables.quantity,
      },
    }).then(response => response.data),
});
