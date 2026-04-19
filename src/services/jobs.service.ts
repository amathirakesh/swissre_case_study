import { AsyncJob } from '../types/jobs';
import { http } from './http';

export interface SplitJobRequest {
  pageRanges: Array<{ start: number; end: number }>;
}

export const jobsService = {
  getStatus(jobId: string) {
    return http<AsyncJob>(`/api/jobs/${jobId}`);
  },
  createSplitJob(documentId: string, payload: SplitJobRequest) {
    return http<{ jobId: string; status: string }>(`/api/documents/${documentId}/jobs/split`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
