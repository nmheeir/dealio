import type { AxiosError } from 'axios';

import type { Product } from '../schemas/product/product.schema';
import type { PaginationResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '../common/client';

type Response = PaginationResponse<Product>;
type Variables = {
  brand?: string | null;
  category?: string | null;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: string;
};

export const useProducts = createQuery<Response, Variables, AxiosError>({
  queryKey: ['/products/for-users-and-guests/filter?'],
  fetcher: (variables) => {
    const params = new URLSearchParams();

    if (variables?.brand) {
      params.set('brandSlug', variables.brand);
    }
    if (variables?.category) {
      params.set('categorySlug', variables.category);
    }

    if (variables?.page) {
      params.set('page', variables.page.toString());
    }

    if (variables?.sortBy) {
      params.set('sortBy', variables.sortBy);
    }

    if (variables?.order) {
      params.set('order', variables.order);
    }

    if (variables?.limit) {
      params.set('limit', variables.limit.toString());
    } else {
      params.set('limit', '1000');
    }

    return apiClient
      .get(`/products/for-users-and-guests/filter?${params.toString()}`)
      .then((response) => {
        return response.data;
      });
  },
});
