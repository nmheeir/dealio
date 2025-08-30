import type { AxiosError } from 'axios';
import type { ApiResponse } from '../types';

import type { Category } from './type';
import { createQuery } from 'react-query-kit';
import { client } from '../common';

type Response = ApiResponse<Category[]>;
type Variables = void;

export const useCategories = createQuery<Response, Variables, AxiosError>({
  queryKey: ['categories'],
  fetcher: () => {
    return client.get(`categories`).then(response => response.data);
  },
});
