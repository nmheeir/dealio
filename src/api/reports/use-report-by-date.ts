import type { AxiosError } from 'axios';
import type { ReportDateSales } from '../schemas/reports/report-date.schema';

import type { PaginationRequest, PaginationResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = {
  startDate: Date;
  endDate: Date;
  request: PaginationRequest;
};
type Response = PaginationResponse<ReportDateSales>;

export const useReportByDate = createQuery<Response, Variables, AxiosError>({
  queryKey: ['reports/sales/daily'],
  fetcher: (variables) => {
    const urlParams = new URLSearchParams();
    urlParams.set('startDate', variables.startDate.toISOString());
    urlParams.set('endDate', variables.endDate.toISOString());
    urlParams.set('limit', String(1000));
    return apiClient
      .get(`reports/sales/daily?${urlParams}`)
      .then(response => response.data);
  },
});
