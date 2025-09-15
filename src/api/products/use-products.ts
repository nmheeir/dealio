import type { AxiosError } from 'axios';

import type { ProductVariant } from '../schemas/product/product-variant.schema';
import type { PaginationResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '../common/client';

type Response = PaginationResponse<ProductVariant>;
type Variables = {
  name?: string | null;
  brand?: string | null;
  category?: string | null;
  page?: number;
  limit?: number;
};

export const useProducts = createQuery<Response, Variables, AxiosError>({
  queryKey: ['/product-variants/for-users-and-guests/search'],
  fetcher: (variables) => {
    const params = new URLSearchParams();

    if (variables?.name) {
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
    if (variables?.limit) {
      params.set('limit', variables.limit.toString());
    } else {
      params.set('limit', '1000');
    }

    return apiClient
      .get(`/product-variants/for-users-and-guests/search?${params.toString()}`)
      .then((response) => {
        return response.data;
      });
  },
});
