import type { AxiosError } from 'axios';
import type { ProductVariant } from '../schemas/product/product-variant.schema';
import { createMutation } from 'react-query-kit';
import apiClient from '../common/client';

export type VariantUpdate = Partial<Omit<ProductVariant, 'id' | 'images' | 'product' | 'stock'>> & {
  other_attributes?: Record<string, string>;
};

type Response = {
  success: boolean;
  message: string;
  data?: ProductVariant;
};

type Variables = {
  id: string;
  data: VariantUpdate;
};

export const useUpdateVariant = createMutation<Response, Variables, AxiosError>({
  mutationFn: async ({ id, data }) =>
    apiClient({
      url: `product-variants/${id}`,
      method: 'PUT',
      data,
    }).then(response => response.data),
});
