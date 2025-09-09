import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';
import apiClient from '../common/client';

type Variables = {
  email: string;
  code: string;
  newPassword: string;
};

type Response = {
  message: string;
};

export const useVerifyResetPassword = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) => {
    const { email, code, newPassword } = variables;

    const response = await apiClient.post(
      `/auth/reset-password-verify?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`,
      {
        newPassword,
      },
    );

    return response.data;
  },
});
