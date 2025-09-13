import type { AxiosError } from 'axios';
import type { Address } from '../schemas/user/adddress.schema';

import type { PaginationResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '../common/client';

type Response = PaginationResponse<Address>;
type Variables = void;

export const useAddresses = createQuery<Response, Variables, AxiosError>({
  queryKey: ['addresses'],
  fetcher: () => {
    return apiClient.get(`addresses`).then(response => response.data);
  },
});
