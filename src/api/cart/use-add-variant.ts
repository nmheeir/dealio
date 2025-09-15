import type { AxiosError } from 'axios';
import type { ApiResponse } from '../types';

import { createMutation } from 'react-query-kit';
import apiClient from '../common/client';

type Variables = {
  productVariantId: string;
  quantity: number;
};
type Response = ApiResponse<any>;

export const useAddVariantToCart = createMutation<Response, Variables, AxiosError>({
  mutationFn: async variables =>
    apiClient({
      url: 'carts',
      method: 'POST',
      data: variables,
    }).then(response => response.data),
});
