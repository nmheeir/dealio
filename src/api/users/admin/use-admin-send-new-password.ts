import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/api/types';

import { createMutation } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = {
  userId: string;
};
type Response = ApiResponse<any>;

export const useAdminSendNewPassword = createMutation<Response, Variables, AxiosError>({
  mutationFn: async variables =>
    apiClient({
      url: 'users/admin/gennerate-user-password',
      method: 'PATCH',
      data: variables,
    }).then(response => response.data),
});
