import { QueryClient } from '@tanstack/react-query';

let queryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  console.log('Query client: ', queryClient);

  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5, // 5 minutes
          gcTime: 1000 * 60 * 10, // 10 minutes
        },
      },
    });
  }
  return queryClient;
}
