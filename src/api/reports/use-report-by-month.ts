import type { AxiosError } from 'axios';
import type { ReportMonthlySales } from '../schemas/reports/report-monthly.schema';

import type { PaginationRequest, PaginationResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = {
  year: number;
  request: PaginationRequest;
};
type Response = PaginationResponse<ReportMonthlySales>;

export const useReportByMonth = createQuery<Response, Variables, AxiosError>({
  queryKey: ['reports/sales/monthly'],
  fetcher: (variables) => {
    const urlParams = new URLSearchParams();
    urlParams.set('year', String(variables.year));
    urlParams.set('limit', String(1000));
    return apiClient
      .get(`reports/sales/monthly?${urlParams}`)
      .then(response => response.data);
  },
});
