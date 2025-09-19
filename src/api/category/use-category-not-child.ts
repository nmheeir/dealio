import type { AxiosError } from 'axios';
import type { Category } from '../schemas/category/category.schema';

import type { PaginationRequest, PaginationResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Response = PaginationResponse<Category>;
type Variables = {
  request?: PaginationRequest;
};

export const useCategoryNotChild = createQuery<Response, Variables, AxiosError>({
  queryKey: ['categories/not-child'],
  fetcher: (variables = {}) => {
    const searchParams = new URLSearchParams();
    if (variables.request?.limit) {
      searchParams.set('limit', String(variables.request.limit));
    } else {
      searchParams.set('limit', String(1000));
    }
    return apiClient.get(`categories/not-child`).then(response => response.data);
  },
});
