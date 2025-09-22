import type { AxiosError } from 'axios';
import type { ReportByTimeRange } from '@/api/schemas/reports/report-by-time-range.schema';

import type { ApiResponse } from '@/api/types';
import { createQuery } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = {
  startDate: Date;
  endDate: Date;
};
type Response = ApiResponse<ReportByTimeRange>;

export const useReportByTimeRange = createQuery<Response, Variables, AxiosError>({
  queryKey: ['reports/admin/sales-by-time-range'],
  fetcher: (variables) => {
    const urlParams = new URLSearchParams();
    urlParams.set('startDate', variables.startDate.toISOString());
    urlParams.set('endDate', variables.endDate.toISOString());
    return apiClient
      .get(`reports/admin/sales-by-time-range?${urlParams}`)
      .then(response => response.data);
  },
});
