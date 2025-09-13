import type { AxiosError } from 'axios';
import type { ApiResponse } from '../types';

import { createMutation } from 'react-query-kit';
import apiClient from '../common/client';

type Variables = {
  type: 'active' | 'inactive';
  userId: string;
};
type Response = ApiResponse<any>;

export const useActivateUser = createMutation<Response, Variables, AxiosError>({
  mutationFn: async variables =>
    apiClient({
      url: `users/admin/${variables.type}/${variables.userId}`,
      method: 'PATCH',
    }).then(response => response.data),
});
