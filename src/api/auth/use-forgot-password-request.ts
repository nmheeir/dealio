import type { AxiosError } from 'axios';
import type { ApiResponse } from '../types';

import { createMutation } from 'react-query-kit';
import apiClient from '../common/client';

type Variables = { email: string };
type Response = ApiResponse<any>;

export const useForgotPasswordRequest = createMutation<Response, Variables, AxiosError>({
  mutationFn: async variables =>
    apiClient({
      url: 'auth/reset-password-request',
      method: 'POST',
      data: variables,
    }).then(response => response.data),
});
