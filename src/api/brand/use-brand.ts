import type { AxiosError } from 'axios';
import type { Brand } from '../schemas/brand/brand.schema';

import type { PaginationResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '../common/client';

type Response = PaginationResponse<Brand>;
type Variables = void;

export const useBrands = createQuery<Response, Variables, AxiosError>({
  queryKey: ['brands'],
  fetcher: () => {
    return apiClient.get(`brands`).then(response => response.data);
  },
});
