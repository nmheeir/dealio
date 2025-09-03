import type { AxiosError } from 'axios';
import type { ProductVariant } from '../product-variant/types';

import type { PaginationResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '../common/client';

type Response = PaginationResponse<ProductVariant>;
type Variables = {
  name?: string | null;
  brand?: string | null;
  category?: string | null;
  page?: number;
};

export const useProducts = createQuery<Response, Variables, AxiosError>({
  queryKey: ['products'],
  fetcher: (variables) => {
    const params = new URLSearchParams();

    if (variables.name) {
      params.set('name', variables.name);
    }

    if (variables?.brand) {
      params.set('brandSlug', variables.brand);
    }
    if (variables?.category) {
      params.set('categorySlug', variables.category);
    }

    if (variables?.page) {
      params.set('page', variables.page.toString());
    }

    return apiClient
      .get(`/products/search?${params.toString()}`)
      .then(response => response.data);
  },
});
