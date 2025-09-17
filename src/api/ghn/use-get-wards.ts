import type { AxiosError } from 'axios';
import type { GhnWard } from '../schemas/ghn/ward.schema';

import type { ApiResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '../common/client';

type Variables = {
  districtId: number;
};
type Response = ApiResponse<GhnWard[]>;

export const useGetWardsByDistrictId = createQuery<Response, Variables, AxiosError>({
  queryKey: ['ghn/wards/'],
  fetcher: (variables) => {
    return apiClient
      .get(`/ghn/wards/${variables.districtId}`)
      .then(response => response.data);
  },
});
