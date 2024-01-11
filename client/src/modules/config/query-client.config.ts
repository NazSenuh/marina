import { QueryClient } from "react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        keepPreviousData: true,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        cacheTime: Infinity
      }
    }
  });