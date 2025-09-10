import type { AxiosError } from 'axios';
import type { Product } from '../schemas/product/product.schema';

import type { ApiResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '../common/client';

type Variables = {
  id: string;
};
type Response = ApiResponse<Product>;

export const useProductDetail = createQuery<Response, Variables, AxiosError>({
  queryKey: ['products'],
  fetcher: (variables) => {
    return apiClient
      .get(`products/${variables.id}`)
      .then(response => response.data);
  },
});
