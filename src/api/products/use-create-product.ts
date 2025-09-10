import type { AxiosError } from 'axios';
import type { CreateProduct } from '../schemas/product/create-product.schema';

import type { Product } from '../schemas/product/product.schema';
import type { ApiResponse } from '../types';
import { createMutation } from 'react-query-kit';
import apiClient from '../common/client';

type Variables = CreateProduct;
type Response = ApiResponse<Product>;

export const useCreateProduct = createMutation<Response, Variables, AxiosError>({
  mutationFn: async variables =>
    apiClient({
      url: 'products',
      method: 'POST',
      data: variables,
    }).then(response => response.data),
});
