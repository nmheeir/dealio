import type { AxiosError } from 'axios';
import type { ApiResponse } from '../types';

import type { ProductVariant } from './types';
import { createQuery } from 'react-query-kit';
import apiClient from '../common/client';

type Variables = { slug: string };
type Response = ApiResponse<ProductVariant>;

export const useProductVariant = createQuery<Response, Variables, AxiosError>({
  queryKey: ['product-variants'],
  fetcher: (variables) => {
    return apiClient
      .get(`product-variants/${variables.slug}`)
      .then(response => response.data);
  },
});
