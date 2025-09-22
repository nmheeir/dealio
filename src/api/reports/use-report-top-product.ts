import type { AxiosError } from 'axios';
import type { ReportTopProduct } from '../schemas/reports/report-top-product.schema';

import type { PaginationRequest, PaginationResponse } from '../types';
import { createQuery } from 'react-query-kit';
import apiClient from '@/api/common/client';

type Variables = {
  startDate: Date;
  endDate: Date;
  request: PaginationRequest;
};
type Response = PaginationResponse<ReportTopProduct>;

export const useReportTopProduct = createQuery<Response, Variables, AxiosError>({
  queryKey: ['reports/sales/top-products'],
  fetcher: (variables) => {
    const urlParams = new URLSearchParams();
    urlParams.set('startDate', String(variables.startDate));
    urlParams.set('endDate', String(variables.endDate));
    urlParams.set('limit', String(1000));
    return apiClient
      .get(`reports/sales/top-products?${urlParams}`)
      .then(response => response.data);
  },
});
