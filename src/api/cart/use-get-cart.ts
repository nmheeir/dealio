import type { AxiosError } from 'axios';
import type { CartItem } from '../schemas/cart/cart.schema';

import type { PaginationResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '../common/client';

type Response = PaginationResponse<CartItem>;
type Variables = void;

export const useGetCarts = createQuery<Response, Variables, AxiosError>({
  queryKey: ['carts'],
  fetcher: () => {
    return apiClient.get(`carts`).then(response => response.data);
  },
});
