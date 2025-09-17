import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/api/types';
import { createQuery } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = {
  orderId: string;
  productVariantId: string;
};
type Response = ApiResponse<any>;

export const useOrderGetDigialKey = createQuery<Response, Variables, AxiosError>({
  queryKey: ['/orders/digital_keys'],
  fetcher: (variables) => {
    const searchParams = new URLSearchParams();
    searchParams.set('product_variant_id', variables.productVariantId);
    searchParams.set('orderId', variables.orderId);
    return apiClient
      .get(`/orders/digital_keys/${searchParams}`)
      .then(response => response.data);
  },
});
