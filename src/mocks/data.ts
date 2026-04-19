import { Annotation, Comment } from '../types/annotations';
import { ClaimRow } from '../types/claims';
import { DocumentManifest } from '../types/documents';
import { AsyncJob } from '../types/jobs';

export const claims: ClaimRow[] = Array.from({ length: 200 }, (_, index) => ({
  id: `clm-${1000 + index}`,
  claimNumber: `CLM-${1000 + index}`,
  policyNumber: `POL-${7000 + index}`,
  status: (['Open', 'Review', 'Assigned', 'Closed'] as const)[index % 4],
  assignee: ['Priya Shah', 'Arun Patel', 'Sarah Wong', 'Luis Gomez'][index % 4],
  updatedAt: new Date(Date.now() - index * 3_600_000).toISOString(),
  availableActions: ['edit', 'assign', 'viewDocument'],
  documentId: `doc-${1000 + index}`,
}));

export const documentManifests: Record<string, DocumentManifest> = Object.fromEntries(
  claims.map((claim) => [
    claim.documentId,
    {
      documentId: claim.documentId,
      claimId: claim.id,
      fileName: `${claim.claimNumber.toLowerCase()}-evidence.pdf`,
      pageCount: 428,
      version: '17',
      permissions: {
        canAnnotate: true,
        canComment: true,
        canSplit: true,
        canMerge: false,
        canDelete: false,
      },
      pages: Array.from({ length: 6 }, (_, pageIndex) => ({
        pageNumber: pageIndex + 1,
        thumbnailUrl: `/mock-assets/${claim.documentId}/thumb-${pageIndex + 1}.jpg`,
        streamUrl: `/mock-assets/${claim.documentId}/page-${pageIndex + 1}`,
        width: 1440,
        height: 1920,
      })),
    },
  ]),
);

export const commentsByDocument: Record<string, Comment[]> = Object.fromEntries(
  claims.map((claim) => [
    claim.documentId,
    [
      {
        id: `${claim.documentId}-comment-1`,
        documentId: claim.documentId,
        pageNumber: 1,
        text: 'Policy number mismatch noted for follow-up review.',
        createdBy: 'QA Reviewer',
        createdAt: '2026-04-19T08:00:00Z',
      },
    ],
  ]),
);

export const annotationsByDocument: Record<string, Annotation[]> = Object.fromEntries(
  claims.map((claim) => [
    claim.documentId,
    [
      {
        id: `${claim.documentId}-annotation-1`,
        documentId: claim.documentId,
        pageNumber: 2,
        type: 'highlight',
        text: 'Potential fraud indicator marker.',
        createdBy: 'Adjuster',
      },
    ],
  ]),
);

export const jobs: Record<string, AsyncJob> = {
  'job-501': {
    jobId: 'job-501',
    type: 'document.split',
    status: 'running',
    progress: 60,
    result: null,
    error: null,
    cancelAllowed: true,
  },
};
