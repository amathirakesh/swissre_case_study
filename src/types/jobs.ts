export type JobStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';

export interface AsyncJob {
  jobId: string;
  type: string;
  status: JobStatus;
  progress: number;
  result: string | null;
  error: string | null;
  cancelAllowed: boolean;
}
