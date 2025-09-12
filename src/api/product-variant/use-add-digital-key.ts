import type { AxiosError } from 'axios';
import type { ApiResponse } from '../types';

import { createMutation } from 'react-query-kit';
import apiClient from '../common/client';

type Variables = {
  id: string;
  file: File;
};
type Response = ApiResponse<any>;

export const useAddDigitalKey = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) => {
    const formData = new FormData();
    formData.append('digital_keys_csv', variables.file);

    const { data } = await apiClient({
      url: `product-variants/${variables.id}/digital-keys`,
      method: 'PATCH',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data;
  },
});
