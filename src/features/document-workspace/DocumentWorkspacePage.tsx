import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import { LoadingState } from '../../components/LoadingState';
import { useJobStatus } from '../../hooks/useJobStatus';
import { annotationsService } from '../../services/annotations.service';
import { documentsService } from '../../services/documents.service';
import { jobsService } from '../../services/jobs.service';
import { useUiStore } from '../../store/ui-store';
import { CommentsPanel } from '../annotations/CommentsPanel';
import { AnnotationsPanel } from '../annotations/AnnotationsPanel';

interface DocumentWorkspacePageProps {
  claimId: string;
  documentId: string;
}

export function DocumentWorkspacePage({ claimId, documentId }: DocumentWorkspacePageProps) {
  const activeWorkspaceTab = useUiStore((state) => state.activeWorkspaceTab);
  const setActiveWorkspaceTab = useUiStore((state) => state.setActiveWorkspaceTab);
  const policies = useUiStore((state) => state.getActivePolicies());
  const [jobId, setJobId] = useState<string | null>(null);

  const manifestQuery = useQuery({
    queryKey: ['document-manifest', documentId],
    queryFn: () => documentsService.getManifest(documentId),
  });

  const commentsQuery = useQuery({
    queryKey: ['comments', documentId],
    queryFn: () => annotationsService.getComments(documentId),
  });

  const annotationsQuery = useQuery({
    queryKey: ['annotations', documentId],
    queryFn: () => annotationsService.getAnnotations(documentId),
  });

  const splitJobMutation = useMutation({
    mutationFn: () => jobsService.createSplitJob(documentId, { pageRanges: [{ start: 1, end: 3 }] }),
    onSuccess: (result) => {
      setJobId(result.jobId);
    },
  });
  const jobStatusQuery = useJobStatus(jobId);

  if (manifestQuery.isLoading) {
    return <LoadingState title="Loading document workspace" />;
  }

  if (manifestQuery.isError) {
    return <ErrorState message={manifestQuery.error.message} onRetry={() => void manifestQuery.refetch()} />;
  }

  if (!manifestQuery.data) {
    return <EmptyState title="Document unavailable" message="The requested document manifest could not be resolved." />;
  }

  const manifest = manifestQuery.data;

  return (
    <section className="section">
      <div className="section-header">
        <div>
          <h1 className="section-title">Document Workspace</h1>
          <p className="section-copy">
            Claim {claimId} with server-issued permissions, partial page loading, and async job-backed structural document actions.
          </p>
        </div>
        <div className="toolbar">
          <button className="button button--secondary" type="button" disabled={!manifest.permissions.canDelete}>
            Delete
          </button>
          <button
            className="button button--secondary"
            type="button"
            disabled={!manifest.permissions.canMerge || !policies.canMergeDocument}
          >
            Merge
          </button>
          <button
            className="button"
            type="button"
            disabled={!manifest.permissions.canSplit || !policies.canSplitDocument || splitJobMutation.isPending}
            onClick={() => splitJobMutation.mutate()}
          >
            {splitJobMutation.isPending ? 'Queueing Split...' : 'Split (Async Job)'}
          </button>
        </div>
      </div>

      <div className="meta-grid">
        <div className="meta-item">
          <strong>{manifest.fileName}</strong>
          <div>{manifest.pageCount} pages</div>
        </div>
        <div className="meta-item">
          <strong>Workspace model</strong>
          <div>Manifest first, visible pages later, annotations outside the binary payload.</div>
        </div>
        <div className="meta-item">
          <strong>Active demo permissions</strong>
          <div>{policies.canSplitDocument ? 'Split enabled' : 'Split blocked'} / {policies.canMergeDocument ? 'Merge enabled' : 'Merge blocked'}</div>
        </div>
        <div className="meta-item">
          <strong>Async job state</strong>
          <div>
            {jobStatusQuery.data
              ? `${jobStatusQuery.data.status} (${jobStatusQuery.data.progress}% complete)`
              : 'No active background job'}
          </div>
        </div>
      </div>

      <div className="workspace">
        <div className="card workspace-viewer">
          <div className="toolbar">
            <button className="button button--secondary" type="button">
              Previous Page
            </button>
            <button className="button button--secondary" type="button">
              Next Page
            </button>
            <button className="button button--secondary" type="button">
              Zoom
            </button>
          </div>
          <div className="page-placeholder">
            <div>
              <strong>Document viewer placeholder</strong>
              <p>This is where a real page renderer such as PDF.js would progressively load visible pages through signed URLs or range requests.</p>
            </div>
          </div>
        </div>

        <aside className="stack">
          <div className="card workspace-panel">
            <div className="toolbar">
              <button
                className={activeWorkspaceTab === 'comments' ? 'button' : 'button button--secondary'}
                type="button"
                onClick={() => setActiveWorkspaceTab('comments')}
              >
                Comments
              </button>
              <button
                className={activeWorkspaceTab === 'annotations' ? 'button' : 'button button--secondary'}
                type="button"
                onClick={() => setActiveWorkspaceTab('annotations')}
              >
                Annotations
              </button>
            </div>
          </div>

          {activeWorkspaceTab === 'comments' ? (
            <CommentsPanel comments={commentsQuery.data ?? []} isLoading={commentsQuery.isLoading} />
          ) : (
            <AnnotationsPanel annotations={annotationsQuery.data ?? []} isLoading={annotationsQuery.isLoading} />
          )}
        </aside>
      </div>
    </section>
  );
}
