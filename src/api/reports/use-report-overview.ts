import type { AxiosError } from 'axios';
import type { ReportSalesOverviewData } from '../schemas/reports/report-sale-overview.schema';

import type { ApiResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = {
  month: number;
  year: number;
};
type Response = ApiResponse<ReportSalesOverviewData>;

export const useReportOverview = createQuery<Response, Variables, AxiosError>({
  queryKey: ['reports/sales/overview'],
  fetcher: (variables) => {
    const urlParams = new URLSearchParams();
    urlParams.set('month', String(variables.month));
    urlParams.set('year', String(variables.year));
    return apiClient
      .get(`reports/sales/overview?${urlParams}`)
      .then(response => response.data);
  },
});
