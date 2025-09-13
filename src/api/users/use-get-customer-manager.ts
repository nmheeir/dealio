import type { AxiosError } from 'axios';
import type { Customer } from '../schemas/user/customer.schema';

import type { PaginationResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '../common/client';

type Response = PaginationResponse<Customer>;
type Variables = void;

export const useGetAllCustomers = createQuery<Response, Variables, AxiosError>({
  queryKey: ['users/manager'],
  fetcher: () => {
    return apiClient.get(`users/manager`).then(response => response.data);
  },
});
