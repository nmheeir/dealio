import type { AxiosError } from 'axios';
import type { ApiResponse } from '../types';

import { createQuery } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = {
  orderCode: string;
};
type Response = ApiResponse<string>;

export const useGhnGetTrackingUrl = createQuery<Response, Variables, AxiosError>({
  queryKey: ['ghn/tracking-url'],
  fetcher: (variables) => {
    return apiClient
      .get(`ghn/tracking-url/${variables.orderCode}`)
      .then(response => response.data);
  },
});
