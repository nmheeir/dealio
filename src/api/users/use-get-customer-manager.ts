import type { AxiosError } from 'axios';
import type { UserProfile } from '../schemas/user/user-profile.schema';

import type { PaginationResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '../common/client';

type Response = PaginationResponse<UserProfile>;
type Variables = void;

export const useGetAllCustomers = createQuery<Response, Variables, AxiosError>({
  queryKey: ['users/manager'],
  fetcher: () => {
    return apiClient.get(`users/manager`).then(response => response.data);
  },
});
