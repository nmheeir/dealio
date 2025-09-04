import type { AxiosError } from 'axios';
import type { SignUpCredentials } from './type';

import { createMutation } from 'react-query-kit';
import apiClient from '../common/client';

type Variables = SignUpCredentials;
type Response = {
  statusCode: number;
  message: string;
};

export const useSignup = createMutation<Response, Variables, AxiosError>({
  mutationFn: async variables =>
    apiClient({
      url: '/auth/register',
      method: 'POST',
      data: variables,
    }).then(response => response.data),
});
