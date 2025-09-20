import type { AxiosError } from 'axios';
import type { Profile } from '../schemas/user/profile.schema';

import type { ApiResponse } from '../types';
import { createMutation } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = {
  fullname: string;
};
type Response = ApiResponse<Profile>;

export const useProfileUpdate = createMutation<Response, Variables, AxiosError>({
  mutationFn: async variables =>
    apiClient({
      url: 'profiles',
      method: 'PATCH',
      data: variables,
    }).then(response => response.data),
});
