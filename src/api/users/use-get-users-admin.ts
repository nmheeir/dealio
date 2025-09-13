import type { AxiosError } from 'axios';
import type { User } from '../schemas/user/user.schema';

import type { PaginationRequest, PaginationResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '../common/client';

type Response = PaginationResponse<User>;
type Variables = PaginationRequest;

export const useGetAllUsers = createQuery<Response, Variables, AxiosError>({
  queryKey: ['users/admin'],
  fetcher: (variables) => {
    const searchParams = new URLSearchParams();
    if (variables?.limit) {
      searchParams.set('limit', String(variables.limit));
    } else {
      searchParams.set('limit', '10000');
    }
    return apiClient.get(`users/admin?${searchParams}`).then(response => response.data);
  },
});
