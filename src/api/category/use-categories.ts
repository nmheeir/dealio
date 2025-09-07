import type { AxiosError } from 'axios';
import type { Category } from '../schemas/category/category.schema';

import type { PaginationResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '../common/client';

type Response = PaginationResponse<Category>;
type Variables = void;

export const useCategories = createQuery<Response, Variables, AxiosError>({
  queryKey: ['categories'],
  fetcher: () => {
    return apiClient.get(`categories`).then(response => response.data);
  },
});
