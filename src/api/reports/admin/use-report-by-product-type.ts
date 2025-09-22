import type { AxiosError } from 'axios';
import type { ReportByProductType } from '@/api/schemas/reports/report-by-product-type.schema';

import type { PaginationResponse } from '@/api/types';
import { createQuery } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = {
  productType?: 'CARD_DIGITAL_KEY' | 'DEVICE' | 'CARD_PHYSICAL';
};
type Response = PaginationResponse<ReportByProductType>;

export const useReportByProductType = createQuery<Response, Variables, AxiosError>({
  queryKey: ['reports/admin/sales-by-product'],
  fetcher: (variables) => {
    const urlParams = new URLSearchParams();
    if (variables?.productType) {
      urlParams.set('productType', variables.productType);
    }
    return apiClient
      .get(`reports/admin/sales-by-product?${urlParams}`)
      .then(response => response.data);
  },
});
