import type { AxiosError } from 'axios';
import type { GhnDistrict } from '../schemas/ghn/district.schema';

import type { ApiResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '../common/client';

type Variables = {
  provinceId: number;
};
type Response = ApiResponse<GhnDistrict[]>;

export const useGetDistrictByProvinceId = createQuery<Response, Variables, AxiosError>({
  queryKey: ['ghn/districts/'],
  fetcher: (variables) => {
    return apiClient
      .get(`/ghn/districts/${variables.provinceId}`)
      .then(response => response.data);
  },
});
