import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportService } from '../services/storageService';
import { SavedReport } from '../types';

export const useReports = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['reports', userId],
    queryFn: async () => {
      if (!userId) return [];
      return await reportService.getUserReports(userId);
    },
    enabled: !!userId,
  });
};

export const useReport = (reportId: string | undefined) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['report', reportId],
    queryFn: async () => {
      if (!reportId) return null;
      return await reportService.getReportById(reportId);
    },
    enabled: !!reportId,
    initialData: () => {
      // Optmization: Check if this report already exists in ANY user reports list
      if (!reportId) return undefined;
      
      const queries = queryClient.getQueriesData<SavedReport[]>({ queryKey: ['reports'] });
      
      for (const [_, reports] of queries) {
        if (!reports) continue;
        const found = reports.find(r => r.id === reportId);
        if (found) {
          return found;
        }
      }
      return undefined;
    },
    // If we found it in initialData, consider it fresh for now to avoid immediate refetch
    // unless implicit staleTime (24h) is expired.
  });
};

export const useSaveReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (report: SavedReport) => reportService.saveReport(report),
    onSuccess: (newReportId, variables) => {
      const fullReport = { ...variables, id: newReportId };
      
      // Optimization 1: Update the specific report cache immediately
      queryClient.setQueryData(['report', newReportId], fullReport);

      // Optimization 2: Optimistically update the list if we know the userId
      if (variables.userId) {
        queryClient.setQueryData(['reports', variables.userId], (old: SavedReport[] | undefined) => {
           if (!old) return [fullReport];
           return [fullReport, ...old];
        });
        
        // Also invalidate to be safe (will trigger refetch in background if stale)
        queryClient.invalidateQueries({ queryKey: ['reports', variables.userId] });
      }
    },
  });
};
