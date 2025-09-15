import type { AxiosError } from 'axios';
import type { ApiResponse } from '../types';

import { createMutation } from 'react-query-kit';
import apiClient from '../common/client';

type Variables = {
  productVariantId: string;
};
type Response = ApiResponse<any>;

export const useDeleteCartItem = createMutation<Response, Variables, AxiosError>({
  mutationFn: async variables =>
    apiClient({
      url: `carts?productVariantId=${variables.productVariantId}`,
      method: 'DELETE',
    }).then(response => response.data),
});
