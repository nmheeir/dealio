import type { AxiosError } from 'axios';
import type { CartItem } from '../schemas/cart/cart.schema';

import type { PaginationRequest, PaginationResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '../common/client';

type Response = PaginationResponse<CartItem>;
type Variables = {
  cartType: string;
  request?: PaginationRequest;
};

export const useGetCarts = createQuery<Response, Variables, AxiosError>({
  queryKey: ['carts'],
  fetcher: (variables) => {
    const searchParams = new URLSearchParams();
    searchParams.set('cartType', variables.cartType);
    if (variables.request?.limit) {
      searchParams.set('limit', String(variables.request.limit));
    } else {
      searchParams.set('limit', '1000');
    }
    return apiClient.get(`carts?${searchParams}`).then(response => response.data);
  },
});
