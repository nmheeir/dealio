import type { AxiosError } from 'axios';
import type { GhnProvince } from '../schemas/ghn/province.schema';

import type { ApiResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '../common/client';

type Response = ApiResponse<GhnProvince[]>;
type Variables = void;

export const useGetAllProvinces = createQuery<Response, Variables, AxiosError>({
  queryKey: ['ghn/provinces'],
  fetcher: () => {
    return apiClient.get(`/ghn/provinces`).then(response => response.data);
  },
});
