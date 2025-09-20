import type { AxiosError } from 'axios';
import type { ApiResponse } from '../types';

import { createMutation } from 'react-query-kit';
import apiClient from '../common/client';

type Variables = {
  file: File;
};

type Response = ApiResponse<any>;

export const useUpdateProfileImage = createMutation<Response, Variables, AxiosError>({
  mutationFn: async ({ file }) => {
    const formData = new FormData();

    // chỉ 1 field duy nhất: image
    formData.append('file', file);

    const response = await apiClient({
      url: `profiles/update-image`,
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
});
