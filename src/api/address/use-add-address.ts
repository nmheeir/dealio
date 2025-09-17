import type { AxiosError } from 'axios';
import type { Address } from '../schemas/user/adddress.schema';

import type { ApiResponse } from '../types';
import { createMutation } from 'react-query-kit';
import apiClient from '../common/client';

type Variables = any;
type Response = ApiResponse<Address>;

export const useAddAddress = createMutation<Response, Variables, AxiosError>({
  mutationFn: async variables =>
    apiClient({
      url: 'addresses',
      method: 'POST',
      data: variables,
    }).then(response => response.data),
});
