import type { AxiosError } from 'axios';
import type { ApiResponse } from '../types';

import type { Brand } from './type';
import { createQuery } from 'react-query-kit';
import { client } from '../common';

type Response = ApiResponse<Brand[]>;
type Variables = void;

export const useBrands = createQuery<Response, Variables, AxiosError>({
  queryKey: ['brands'],
  fetcher: () => {
    return client.get(`brands`).then(response => response.data);
  },
});
