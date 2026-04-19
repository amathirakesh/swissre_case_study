import { useQuery } from '@tanstack/react-query';
import { jobsService } from '../services/jobs.service';

export function useJobStatus(jobId: string | null) {
  return useQuery({
    queryKey: ['job-status', jobId],
    queryFn: () => jobsService.getStatus(jobId as string),
    enabled: Boolean(jobId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && ['succeeded', 'failed', 'cancelled'].includes(status) ? false : 4_000;
    },
  });
}
