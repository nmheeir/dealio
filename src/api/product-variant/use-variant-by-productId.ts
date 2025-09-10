import type { AxiosError } from 'axios';
import type { ProductVariant } from '../schemas/product/product-variant.schema';

import type { ApiResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '../common/client';

type Variables = {
  id: string;
};
type Response = ApiResponse<ProductVariant[]>;

export const useGetVariantsByProductId = createQuery<Response, Variables, AxiosError>({
  queryKey: ['product-variants/productId-with-cost-price'],
  fetcher: (variables) => {
    return apiClient
      .get(`product-variants/productId-with-cost-price/${variables.id}`)
      .then(response => response.data);
  },
});
