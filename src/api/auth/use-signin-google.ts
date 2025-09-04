import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import apiClient from '../common/client';

type Response = { html: string };
type Variables = void;

export const useSigninGoogle = createQuery<Response, Variables, AxiosError>({
  queryKey: ['/signin/google'],
  fetcher: () => {
    return apiClient.get(`/signin/google`).then(response => response.data);
  },
});
