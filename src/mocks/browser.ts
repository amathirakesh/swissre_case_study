import { annotationsByDocument, claims, commentsByDocument, documentManifests, jobs } from './data';
import {
  canViewClaim,
  getAvailableClaimActions,
  getClaimSegment,
  getDocumentPermissions,
  readDemoRole,
} from './rbac';
import { ClaimsSearchRequest } from '../types/claims';

const originalFetch = window.fetch.bind(window);

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    ...init,
  });
}

function textResponse(body: string, init?: ResponseInit) {
  return new Response(body, init);
}

async function handleMockRequest(input: RequestInfo | URL, init?: RequestInit): Promise<Response | null> {
  const url = typeof input === 'string' ? new URL(input, window.location.origin) : new URL(input.toString(), window.location.origin);
  const method = (init?.method ?? 'GET').toUpperCase();
  const role = readDemoRole(new Headers(init?.headers).get('X-Demo-Role'));

  if (url.pathname === '/api/claims/search' && method === 'POST') {
    await delay(550);
    const requestBody = init?.body ? (JSON.parse(String(init.body)) as ClaimsSearchRequest) : null;

    if (!requestBody) {
      return textResponse('Missing request payload', { status: 400 });
    }

    const claimNumberFilter = requestBody.filters.find(
      (filter) => filter.field === 'claimNumber' && typeof filter.value === 'string',
    );
    const statusFilter = requestBody.filters.find((filter) => filter.field === 'status' && typeof filter.value === 'string');
    const segmentFilter = requestBody.filters.find((filter) => filter.field === 'segment' && typeof filter.value === 'string');

    let filtered = claims
      .filter((claim) => canViewClaim(role, claim))
      .map((claim) => ({
        ...claim,
        availableActions: getAvailableClaimActions(role, claim),
      }));

    if (claimNumberFilter && typeof claimNumberFilter.value === 'string') {
      filtered = filtered.filter((claim) =>
        claim.claimNumber.toLowerCase().includes(claimNumberFilter.value.toLowerCase()),
      );
    }

    if (statusFilter && typeof statusFilter.value === 'string') {
      filtered = filtered.filter((claim) => claim.status === statusFilter.value);
    }

    if (segmentFilter && typeof segmentFilter.value === 'string') {
      filtered = filtered.filter((claim) => getClaimSegment(claim) === segmentFilter.value);
    }

    const start = (requestBody.page - 1) * requestBody.pageSize;

    return jsonResponse({
      items: filtered.slice(start, start + requestBody.pageSize),
      page: requestBody.page,
      pageSize: requestBody.pageSize,
      total: 20384,
    });
  }

  const manifestMatch = url.pathname.match(/^\/api\/documents\/([^/]+)\/manifest$/);
  const commentsMatch = url.pathname.match(/^\/api\/documents\/([^/]+)\/comments$/);
  const annotationsMatch = url.pathname.match(/^\/api\/documents\/([^/]+)\/annotations$/);
  const splitJobMatch = url.pathname.match(/^\/api\/documents\/([^/]+)\/jobs\/split$/);

  if (manifestMatch && method === 'GET') {
    const manifest = documentManifests[manifestMatch[1]];

    if (!manifest) {
      return textResponse('Document not found', { status: 404 });
    }

    const relatedClaim = claims.find((claim) => claim.documentId === manifest.documentId);

    if (!relatedClaim || !canViewClaim(role, relatedClaim)) {
      return textResponse('Forbidden', { status: 403 });
    }

    return jsonResponse({
      ...manifest,
      permissions: getDocumentPermissions(role),
    });
  }

  if (commentsMatch && method === 'GET') {
    const relatedClaim = claims.find((claim) => claim.documentId === commentsMatch[1]);

    if (!relatedClaim || !canViewClaim(role, relatedClaim)) {
      return textResponse('Forbidden', { status: 403 });
    }

    return jsonResponse(commentsByDocument[commentsMatch[1]] ?? []);
  }

  if (annotationsMatch && method === 'GET') {
    const relatedClaim = claims.find((claim) => claim.documentId === annotationsMatch[1]);

    if (!relatedClaim || !canViewClaim(role, relatedClaim)) {
      return textResponse('Forbidden', { status: 403 });
    }

    return jsonResponse(annotationsByDocument[annotationsMatch[1]] ?? []);
  }

  if (splitJobMatch && method === 'POST') {
    const relatedClaim = claims.find((claim) => claim.documentId === splitJobMatch[1]);
    const permissions = getDocumentPermissions(role);

    if (!relatedClaim || !canViewClaim(role, relatedClaim) || !permissions.canSplit) {
      return textResponse('Forbidden', { status: 403 });
    }

    return jsonResponse(
      {
        jobId: 'job-501',
        status: 'queued',
      },
      { status: 202 },
    );
  }

  const jobMatch = url.pathname.match(/^\/api\/jobs\/([^/]+)$/);

  if (jobMatch && method === 'GET') {
    return jsonResponse(jobs[jobMatch[1]] ?? jobs['job-501']);
  }

  return null;
}

export async function enableMocking() {
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const mockedResponse = await handleMockRequest(input, init);

    if (mockedResponse) {
      return mockedResponse;
    }

    return originalFetch(input, init);
  };
}
