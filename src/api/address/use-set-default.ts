import type { AxiosError } from 'axios';
import type { ApiResponse } from '../types';

import { createMutation } from 'react-query-kit';
import apiClient from '../common/client';

type Variables = { addressId: string };
type Response = ApiResponse<any>;

export const useSetDefaultAddress = createMutation<Response, Variables, AxiosError>({
  mutationFn: async variables =>
    apiClient({
      url: 'addresses/set-default',
      method: 'PATCH',
      data: variables,
    }).then(response => response.data),
});
