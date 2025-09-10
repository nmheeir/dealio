import type { AxiosError } from 'axios';
import type { Category } from '../schemas/category/category.schema';

import type { UpdateCategory } from '../schemas/category/update-category.schema';
import type { ApiResponse } from '../types';
import { createMutation } from 'react-query-kit';
import apiClient from '../common/client';

type Variables = {
  id: string;
  data: UpdateCategory;
};
type Response = ApiResponse<Category>;

export const useUpdateCategory = createMutation<Response, Variables, AxiosError>({
  mutationFn: async variables =>
    apiClient({
      url: `categories/${variables.id}`,
      method: 'PUT',
      data: variables.data,
    }).then(response => response.data),
});
