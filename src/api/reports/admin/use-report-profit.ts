import type { AxiosError } from 'axios';
import type { ReportProfit } from '@/api/schemas/reports/report-profit.schema';

import type { ApiResponse } from '@/api/types';
import { createQuery } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = {
  productType?: string | null;
  orderType?: string | null;
};
type Response = ApiResponse<ReportProfit>;

export const useReportProfit = createQuery<Response, Variables, AxiosError>({
  queryKey: ['reports/admin/profit'],
  fetcher: (variables) => {
    const urlParams = new URLSearchParams();
    if (variables?.orderType) {
      urlParams.set('orderType', variables.orderType);
    }
    if (variables?.productType) {
      urlParams.set('productType', variables.productType);
    }
    return apiClient
      .get(`reports/admin/profit?${urlParams}`)
      .then(response => response.data);
  },
});
