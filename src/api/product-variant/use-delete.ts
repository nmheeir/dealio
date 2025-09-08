import type { AxiosError } from 'axios';
import type { ApiResponse } from '../types';

import { createMutation } from 'react-query-kit';
import apiClient from '../common/client';

type Variables = {
  id: string;
};
type Response = ApiResponse<any>;

export const useDeleteProductVariant = createMutation<Response, Variables, AxiosError>({
  mutationKey: ['delete-product-variant'],
  mutationFn: async variables =>
    apiClient.delete(`product-variants/${variables.id}`).then(response => response.data),
});
