import type { AxiosError } from 'axios';
import type { UserRole } from '../schemas/user/role';

import type { ApiResponse } from '../types';
import { createMutation } from 'react-query-kit';
import apiClient from '../common/client';

type Variables = {
  userId: string;
  role: UserRole;
};
type Response = ApiResponse<any>;

export const useChangeRoleUser = createMutation<Response, Variables, AxiosError>({
  mutationFn: async variables =>
    apiClient({
      url: `users/admin/change-role/${variables.userId}`,
      method: 'PATCH',
      data: {
        role: variables.role,
      },
    }).then(response => response.data),
});
