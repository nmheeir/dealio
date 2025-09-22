import type { AxiosError } from 'axios';
import type { ReportByUser } from '@/api/schemas/reports/report-by-user.schema';

import type { PaginationResponse } from '@/api/types';
import { createQuery } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = {
  customerId: string;
};
type Response = PaginationResponse<ReportByUser>;

export const useReportByUser = createQuery<Response, Variables, AxiosError>({
  queryKey: ['reports/admin/sales-by-customer'],
  fetcher: (variables) => {
    const urlParams = new URLSearchParams();
    urlParams.set('customerId', variables.customerId);
    return apiClient
      .get(`reports/admin/sales-by-customer?${urlParams}`)
      .then(response => response.data);
  },
});
