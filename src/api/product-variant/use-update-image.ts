import type { AxiosError } from 'axios';
import type { ApiResponse } from '../types';

import { createMutation } from 'react-query-kit';
import apiClient from '../common/client';

type Variables = {
  id: string;
  files: File[];
  listKeepUrlImages?: string[];
};
type Response = ApiResponse<any>;

export const useUpdateImage = createMutation<Response, Variables, AxiosError>({
  mutationFn: async ({ id, files, listKeepUrlImages }) => {
    const formData = new FormData();

    // Append file(s)
    files.forEach((file) => {
      formData.append('gallery_images', file);
    });

    // Append DTO nếu có
    // Append keep_images đúng định dạng
    if (listKeepUrlImages && listKeepUrlImages.length > 0) {
      listKeepUrlImages.forEach((url) => {
        formData.append('keep_images', url);
      });
    }

    const response = await apiClient({
      url: `product-variants/${id}/gallery-images`,
      method: 'PUT',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
});
