import type { AxiosError } from 'axios';
import type { DigitalKey } from '../schemas/digital-key/digital-key.schema';

import type { PaginationRequest, PaginationResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '../common/client';

type Response = PaginationResponse<DigitalKey>;
type Variables = {
  variantId: string;
  paginationRequest?: PaginationRequest | null;
};

export const useGetAllDigitalKey = createQuery<Response, Variables, AxiosError>({
  queryKey: ['/product-variants/getAllDigitalKeys/'],
  fetcher: (variables) => {
    const searchParams = new URLSearchParams();

    if (variables.paginationRequest?.page) {
      searchParams.set('page', String(variables.paginationRequest.page));
    }
    if (variables.paginationRequest?.sortBy) {
      searchParams.set('sortBy', variables.paginationRequest.sortBy);
    }
    if (variables.paginationRequest?.order) {
      searchParams.set('order', variables.paginationRequest.order);
    }
    if (variables.paginationRequest?.limit) {
      searchParams.set('limit', String(variables.paginationRequest.limit));
    } else {
      searchParams.set('limit', String(1000));
    }

    return apiClient
      .get(`/product-variants/getAllDigitalKeys/${variables.variantId}?${searchParams.toString()}`)
      .then(response => response.data);
  },
});
