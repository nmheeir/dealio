import type { AxiosError } from 'axios';
import type { ReportWithFilter } from '../schemas/reports/report-with-filter.schema';

import type { ApiResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = {
  startDate: Date;
  endDate: Date;
  orderType: 'DIGITAL' | 'PHYSICAL';
  categoryId?: string | null;
  brandId?: string | null;
};
type Response = ApiResponse<ReportWithFilter>;

export const useReportWithFilter = createQuery<Response, Variables, AxiosError>({
  queryKey: ['reports/sales/filtered'],
  fetcher: (variables) => {
    const urlParams = new URLSearchParams();
    urlParams.set('startDate', String(variables.startDate));
    urlParams.set('endDate', String(variables.endDate));
    return apiClient
      .get(`reports/sales/filtered?${urlParams}`)
      .then(response => response.data);
  },
});
