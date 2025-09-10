import type { AxiosError } from 'axios';
import type { Category } from '../schemas/category/category.schema';

import type { CreateCategory } from '../schemas/category/create-category.schema';
import type { ApiResponse } from '../types';
import { createMutation } from 'react-query-kit';
import apiClient from '../common/client';

type Variables = CreateCategory;
type Response = ApiResponse<Category>;

export const useCreateCategory = createMutation<Response, Variables, AxiosError>({
  mutationFn: async variables =>
    apiClient({
      url: 'categories',
      method: 'POST',
      data: variables,
    }).then(response => response.data),
});
