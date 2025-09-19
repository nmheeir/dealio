import type { AxiosError } from 'axios';
import type { Product } from '../schemas/product/product.schema';

import type { PaginationRequest, PaginationResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = {
  request?: PaginationRequest;
  categorySlug?: string;
  brandSlug?: string;
  orderBy?: string;
};
type Response = PaginationResponse<Product>;

export const useProductFilter = createQuery<Response, Variables, AxiosError>({
  queryKey: ['products/for-users-and-guests/filter'],
  fetcher: (variables = {}) => {
    const searchParams = new URLSearchParams();
    if (variables?.categorySlug) {
      searchParams.set('categorySlug', String(variables.categorySlug));
    }
    if (variables?.brandSlug) {
      searchParams.set('brandSlug', String(variables.brandSlug));
    }
    if (variables?.orderBy) {
      searchParams.set('orderBy', String(variables.orderBy));
    }
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
      .get(`products/for-users-and-guests/filter?${searchParams}`)
      .then(response => response.data);
  },
});
