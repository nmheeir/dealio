import type { AxiosError } from 'axios';

import type { ApiResponse } from '../types';
import type { SearchProductResponse } from './types';
import { createQuery } from 'react-query-kit';
import { client } from '../common';

type Variables = {
  query?: string | null;
  limitProduct?: number | null;
  limitVariant?: number | null;
};
type Response = ApiResponse<SearchProductResponse>;

export const useSearchProductVariant = createQuery<Response, Variables, AxiosError>({
  queryKey: ['product-variants/search'],
  fetcher: (variables) => {
    const params = new URLSearchParams();

    if (variables.query) {
      params.set('query', variables.query);
    }

    return client
      .get(`product-variants/search?${params}`)
      .then(response => response.data);
  },
});
