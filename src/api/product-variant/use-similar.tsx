import type { AxiosError } from 'axios';
import type { ApiResponse } from '../types';

import type { ProductVariant } from './types';
import { createQuery } from 'react-query-kit';
import { client } from '../common';

type Variables = { id: string };
type Response = ApiResponse<ProductVariant[]>;

export const useSimilarProductVariants = createQuery<Response, Variables, AxiosError>({
  queryKey: ['product-variants/similar'],
  fetcher: (variables) => {
    return client
      .get(`product-variants/${variables.id}/similar`)
      .then(response => response.data);
  },
});
