import type { AxiosError } from 'axios';
import type { ReportYearly } from '../schemas/reports/report-year.schema';

import type { ApiResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Response = ApiResponse<ReportYearly[]>;
type Variables = void;

export const useReportByYear = createQuery<Response, Variables, AxiosError>({
  queryKey: ['reports/sales/yearly'],
  fetcher: () => {
    return apiClient.get(`reports/sales/yearly`).then(response => response.data);
  },
});
