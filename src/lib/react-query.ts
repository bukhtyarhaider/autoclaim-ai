import { QueryClient } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24, // 24 hours (User said "preset", so let's keep it really stale/cached)
      gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days (Keep in cache for a long time)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

