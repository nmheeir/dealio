import type { AxiosError } from 'axios';
import type { Brand } from '../schemas/brand/brand.schema';

import type { PaginationResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '../common/client';

type Response = PaginationResponse<Brand>;
type Variables = {
  sortBy?: string | null;
  order?: string | null;
  page?: number;
  limit?: number;
};

export const useBrands = createQuery<Response, Variables, AxiosError>({
  queryKey: ['brands'],
  fetcher: (variables) => {
    const params = new URLSearchParams();

    if (variables?.sortBy) {
      params.set('sortBy', variables.sortBy);
    }

    if (variables?.order) {
      params.set('order', variables.order);
    }

    if (variables?.page) {
      params.set('page', variables.page.toString());
    }
    if (variables?.limit) {
      params.set('limit', variables.limit.toString());
    } else {
      params.set('limit', '1000');
    }
    return apiClient.get(`brands?${params.toString()}`).then(response => response.data);
  },
});
