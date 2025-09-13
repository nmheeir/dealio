import type { AxiosError } from 'axios';
import type { UserRole } from '../schemas/user/role';

import type { ApiResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '../common/client';

type Response = ApiResponse<UserRole>;
type Variables = void;

export const useCheckRole = createQuery<Response, Variables, AxiosError>({
  queryKey: ['auth/role'],
  fetcher: () => {
    return apiClient.get(`auth/role`).then(response => response.data);
  },
});
