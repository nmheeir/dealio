import type { AxiosError } from 'axios';
import type { Product } from '../schemas/product/product.schema';

import type { UpdateProduct } from '../schemas/product/update-product.schema';
import type { ApiResponse } from '../types';
import { createMutation } from 'react-query-kit';
import apiClient from '../common/client';

type Variables = {
  id: string;
  data: UpdateProduct;
};
type Response = ApiResponse<Product>;

export const useUpdateProduct = createMutation<Response, Variables, AxiosError>({
  mutationFn: async variables =>
    apiClient({
      url: `products/${variables.id}`,
      method: 'PUT',
      data: variables.data,
    }).then(response => response.data),
});
