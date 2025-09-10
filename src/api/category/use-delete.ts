import type { AxiosError } from 'axios';
import type { ApiResponse } from '../types';

import { createMutation } from 'react-query-kit';
import apiClient from '../common/client';

type Variables = {
  id: string;
};
type Response = ApiResponse<any>;

export const useDeleteCategory = createMutation<Response, Variables, AxiosError>({
  mutationFn: async variables =>
    apiClient({
      url: `categories/${variables.id}`,
      method: 'DELETE',
      data: variables,
    }).then(response => response.data),
});
