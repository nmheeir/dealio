import type { AxiosError } from 'axios';
import type { ReportByVariant } from '@/api/schemas/reports/report-by-variant.schema';

import type { ApiResponse } from '@/api/types';
import { createQuery } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = {
  variantId: string;
};
type Response = ApiResponse<ReportByVariant>;

export const useReportByVariant = createQuery<Response, Variables, AxiosError>({
  queryKey: ['reports/admin/variant-profit'],
  fetcher: (variables) => {
    return apiClient
      .get(`reports/admin/variant-profit/${variables.variantId}`)
      .then(response => response.data);
  },
});
