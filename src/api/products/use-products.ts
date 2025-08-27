import type { AxiosError } from 'axios';
import type { Product } from './types';

import { createQuery } from 'react-query-kit';
import { client } from '../common';

type Response = Product[];
type Variables = void;

export const useProducts = createQuery<Response, Variables, AxiosError>({
  queryKey: ['products'],
  fetcher: () => {
    return client.get(`products`).then(response => response.data.data);
  },
});
