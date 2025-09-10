import type { AxiosError } from 'axios';
import type { Address, AddressInput } from '../schemas/profile/adddress.schema';

import { createMutation } from 'react-query-kit';
import apiClient from '../common/client';

type Variables = {
  id: string;
  updateData: AddressInput;
};
type Response = Address;

export const useUpdateAddress = createMutation<Response, Variables, AxiosError>({
  mutationFn: async variables =>
    apiClient({
      url: `addresses/update/${variables.id}`,
      method: 'PATCH',
      data: variables.updateData,
    }).then(response => response.data),
});
