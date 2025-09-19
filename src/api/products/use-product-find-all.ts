import type { AxiosError } from 'axios';
import type { Product } from '../schemas/product/product.schema';

import type { PaginationRequest, PaginationResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = {
  request?: PaginationRequest;
};
type Response = PaginationResponse<Product>;

export const useProductFindAll = createQuery<Response, Variables, AxiosError>({
  queryKey: ['products/for-users-and-guests'],
  fetcher: (variables = {}) => {
    const searchParams = new URLSearchParams();
    if (variables.request?.limit) {
      searchParams.set('limit', String(variables.request.limit));
    } else {
      searchParams.set('limit', String(1000));
    }
    if (variables.request?.order) {
      searchParams.set('order', String(variables.request.order));
    }
    if (variables.request?.page) {
      searchParams.set('page', String(variables.request.page));
    }
    if (variables.request?.sortBy) {
      searchParams.set('sortBy', String(variables.request.sortBy));
    }

    return apiClient
      .get(`products/for-users-and-guests?${searchParams}`)
      .then(response => response.data);
  },
});
