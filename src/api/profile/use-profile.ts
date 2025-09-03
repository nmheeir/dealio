import type { AxiosError } from 'axios';
import type { User } from '../auth/type';

import type { ApiResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '../common/client';

type Response = ApiResponse<User>;
type Variables = void;

export const useProfile = createQuery<Response, Variables, AxiosError>({
  queryKey: ['profiles'],
  fetcher: () => {
    return apiClient.get(`profiles`).then(response => response.data);
  },
});
