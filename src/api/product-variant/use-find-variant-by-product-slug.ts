import type { AxiosError } from 'axios';
import type { ProductVariant } from '../schemas/product/product-variant.schema';

import type { ApiResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '../common/client';

type Response = ApiResponse<ProductVariant[]>;
type Variables = {
  slug: string;
};

export const useFindVariantsByProductSlug = createQuery<Response, Variables, AxiosError>({
  queryKey: ['/products/for-users-and-guests/variants/slug'],
  fetcher: (variables) => {
    return apiClient.get(
      `/products/for-users-and-guests/variants/slug/${variables.slug}`,
    ).then(response => response.data);
  },
});
