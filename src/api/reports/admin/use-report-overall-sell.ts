import type { AxiosError } from 'axios';
import type { ReportOverall } from '@/api/schemas/reports/report-overall.schema';

import type { ApiResponse } from '@/api/types';
import { createQuery } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = {
  orderType: 'DIGITAL' | 'PHYSICAL';
};
type Response = ApiResponse<ReportOverall>;

export const useReportOverallSales = createQuery<Response, Variables, AxiosError>({
  queryKey: ['reports/admin/overall-sales'],
  fetcher: (variables) => {
    const urlParams = new URLSearchParams();
    urlParams.set('orderType', String(variables.orderType));

    return apiClient
      .get(`reports/admin/overall-sales?${urlParams}`)
      .then(response => response.data);
  },
});
