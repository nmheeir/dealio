import type { AxiosError } from 'axios';
import type { Brand } from '../schemas/brand/brand.schema';

import type { UpdateBrand } from '../schemas/brand/update-brand.schema';
import type { ApiResponse } from '../types';
import { createMutation } from 'react-query-kit';
import apiClient from '../common/client';

type Variables = {
  id: string;
  data: UpdateBrand;
};
type Response = ApiResponse<Brand>;

export const useUpdateBrand = createMutation<Response, Variables, AxiosError>({
  mutationFn: async variables =>
    apiClient({
      url: `brands/${variables.id}`,
      method: 'PUT',
      data: variables.data,
    }).then(response => response.data),
});
