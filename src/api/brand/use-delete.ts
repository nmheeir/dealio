import type { AxiosError } from 'axios';
import type { ApiResponse } from '../types';

import { createMutation } from 'react-query-kit';
import apiClient from '../common/client';

type Variables = {
  id: string;
};
type Response = ApiResponse<any>;

export const useDeleteBrand = createMutation<Response, Variables, AxiosError>({
  mutationFn: async variables =>
    apiClient({
      url: `brands/${variables.id}`,
      method: 'DELETE',
    }).then(response => response.data),
});
