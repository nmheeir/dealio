import type { AxiosError } from 'axios';
import type { ApiResponse } from '../types';
import { createMutation } from 'react-query-kit';
import apiClient from '../common/client';

type Variables = {
  id: string;
  file: File;
};

type Response = ApiResponse<any>;

export const useUpdateMainImage = createMutation<Response, Variables, AxiosError>({
  mutationFn: async ({ id, file }) => {
    const formData = new FormData();
    formData.append('main_image', file);

    const response = await apiClient({
      url: `product-variants/${id}/main-image`,
      method: 'PUT',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
});
