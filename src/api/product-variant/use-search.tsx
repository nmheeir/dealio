import type { AxiosError } from 'axios';

import type { SearchProductResponse } from '../schemas/product/search-product-response.schema';
import type { ApiResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '../common/client';

type Variables = {
  query?: string | null;
  limitProduct?: number | null;
  limitVariant?: number | null;
};
type Response = ApiResponse<SearchProductResponse>;

export const useSearchProductVariant = createQuery<Response, Variables, AxiosError>({
  queryKey: ['product-variants/for-users-and-guests/search'],
  fetcher: (variables) => {
    const params = new URLSearchParams();

    if (variables.query) {
      params.set('query', variables.query);
    }

    return apiClient
      .get(`product-variants/for-users-and-guests/search?${params}`)
      .then(response => response.data);
  },
});
