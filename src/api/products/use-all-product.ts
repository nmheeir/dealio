import type { AxiosError } from 'axios';

import type { Product } from '../schemas/product/product.schema';
import type { PaginationResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '../common/client';

type Variables = {
  sortBy?: string | null;
  order?: string | null;
  limit?: string | null;
};
type Response = PaginationResponse<Product>;

export const useGetAllProducts = createQuery<Response, Variables, AxiosError>({
  queryKey: ['products'],
  fetcher: (variables) => {
    const searchParams = new URLSearchParams();

    if (variables?.sortBy) {
      searchParams.set('sortBy', variables.sortBy);
    }

    if (variables?.order) {
      searchParams.set('order', variables.order);
    }
    if (variables?.limit) {
      searchParams.set('limit', variables.limit);
    } else {
      searchParams.set('limit', '10000');
    }

    return apiClient
      .get(`products?${searchParams}`)
      .then(response => response.data);
  },
});
