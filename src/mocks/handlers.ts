import { http, HttpResponse } from 'msw';
import { annotationsByDocument, claims, commentsByDocument, documentManifests, jobs } from './data';
import { canViewClaim, getAvailableClaimActions, getClaimSegment, getDocumentPermissions, readDemoRole } from './rbac';
import { ClaimsSearchRequest } from '../types/claims';

export const handlers = [
  http.post('/api/claims/search', async ({ request }) => {
    const body = (await request.json()) as ClaimsSearchRequest;
    const role = readDemoRole(request.headers.get('X-Demo-Role'));
    const claimNumberFilter = body.filters.find((filter) => filter.field === 'claimNumber' && typeof filter.value === 'string');
    const statusFilter = body.filters.find((filter) => filter.field === 'status' && typeof filter.value === 'string');
    const segmentFilter = body.filters.find((filter) => filter.field === 'segment' && typeof filter.value === 'string');

    let filtered = claims
      .filter((claim) => canViewClaim(role, claim))
      .map((claim) => ({
        ...claim,
        availableActions: getAvailableClaimActions(role, claim),
      }));

    if (claimNumberFilter && typeof claimNumberFilter.value === 'string') {
      filtered = filtered.filter((claim) => claim.claimNumber.toLowerCase().includes(claimNumberFilter.value.toLowerCase()));
    }

    if (statusFilter && typeof statusFilter.value === 'string') {
      filtered = filtered.filter((claim) => claim.status === statusFilter.value);
    }

    if (segmentFilter && typeof segmentFilter.value === 'string') {
      filtered = filtered.filter((claim) => getClaimSegment(claim) === segmentFilter.value);
    }

    const start = (body.page - 1) * body.pageSize;
    const items = filtered.slice(start, start + body.pageSize);

    return HttpResponse.json({
      items,
      page: body.page,
      pageSize: body.pageSize,
      total: 20384,
    });
  }),

  http.get('/api/documents/:documentId/manifest', ({ params, request }) => {
    const role = readDemoRole(request.headers.get('X-Demo-Role'));
    const documentId = String(params.documentId);
    const manifest = documentManifests[documentId];

    if (!manifest) {
      return new HttpResponse('Document not found', { status: 404 });
    }

    const relatedClaim = claims.find((claim) => claim.documentId === documentId);

    if (!relatedClaim || !canViewClaim(role, relatedClaim)) {
      return new HttpResponse('Forbidden', { status: 403 });
    }

    return HttpResponse.json({
      ...manifest,
      permissions: getDocumentPermissions(role),
    });
  }),

  http.get('/api/documents/:documentId/comments', ({ params, request }) => {
    const role = readDemoRole(request.headers.get('X-Demo-Role'));
    const documentId = String(params.documentId);
    const relatedClaim = claims.find((claim) => claim.documentId === documentId);

    if (!relatedClaim || !canViewClaim(role, relatedClaim)) {
      return new HttpResponse('Forbidden', { status: 403 });
    }

    return HttpResponse.json(commentsByDocument[documentId] ?? []);
  }),

  http.get('/api/documents/:documentId/annotations', ({ params, request }) => {
    const role = readDemoRole(request.headers.get('X-Demo-Role'));
    const documentId = String(params.documentId);
    const relatedClaim = claims.find((claim) => claim.documentId === documentId);

    if (!relatedClaim || !canViewClaim(role, relatedClaim)) {
      return new HttpResponse('Forbidden', { status: 403 });
    }

    return HttpResponse.json(annotationsByDocument[documentId] ?? []);
  }),

  http.post('/api/documents/:documentId/jobs/split', ({ params, request }) => {
    const role = readDemoRole(request.headers.get('X-Demo-Role'));
    const documentId = String(params.documentId);
    const relatedClaim = claims.find((claim) => claim.documentId === documentId);
    const permissions = getDocumentPermissions(role);

    if (!relatedClaim || !canViewClaim(role, relatedClaim) || !permissions.canSplit) {
      return new HttpResponse('Forbidden', { status: 403 });
    }

    return HttpResponse.json(
      {
        jobId: 'job-501',
        status: 'queued',
      },
      { status: 202 },
    );
  }),

  http.get('/api/jobs/:jobId', ({ params }) => {
    return HttpResponse.json(jobs[String(params.jobId)] ?? jobs['job-501']);
  }),
];
