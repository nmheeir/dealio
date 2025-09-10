import type { AxiosError } from 'axios';
import type { Brand } from '../schemas/brand/brand.schema';

import type { CreateBrand } from '../schemas/brand/create-brand.schema';
import type { ApiResponse } from '../types';
import { createMutation } from 'react-query-kit';
import apiClient from '../common/client';

type Variables = CreateBrand;
type Response = ApiResponse<Brand>;

export const useCreateBrand = createMutation<Response, Variables, AxiosError>({
  mutationFn: async variables =>
    apiClient({
      url: 'brands',
      method: 'POST',
      data: variables,
    }).then(response => response.data),
});
