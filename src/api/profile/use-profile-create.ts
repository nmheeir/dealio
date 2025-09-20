import type { AxiosError } from 'axios';
import type { User } from '../schemas/user/user.schema';

import type { ApiResponse } from '../types';
import { createMutation } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = {
  fullname: string;
};
type Response = ApiResponse<User>;

export const useProfileCreate = createMutation<Response, Variables, AxiosError>({
  mutationFn: async variables =>
    apiClient({
      url: 'profiles',
      method: 'POST',
      data: variables,
    }).then(response => response.data),
});
