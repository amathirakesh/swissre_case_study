import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ClaimsSearchRequest } from '../types/claims';

export interface ClaimsSearchViewState {
  page: number;
  query: string;
  status: string;
  segment: string;
}

interface ClaimsSearchUpdate {
  page?: number;
  query?: string;
  status?: string;
  segment?: string;
}

export function useClaimsSearchParams(): [
  ClaimsSearchRequest,
  ClaimsSearchViewState,
  (next: ClaimsSearchUpdate) => void,
] {
  const [searchParams, setSearchParams] = useSearchParams();

  const viewState = useMemo<ClaimsSearchViewState>(() => {
    const page = Number(searchParams.get('page') ?? 1);
    const query = searchParams.get('query') ?? '';
    const status = searchParams.get('status') ?? '';
    const segment = searchParams.get('segment') ?? 'enterprise';

    return {
      page,
      query,
      status,
      segment,
    };
  }, [searchParams]);

  const request = useMemo<ClaimsSearchRequest>(() => {
    const { page, query, status, segment } = viewState;

    return {
      page,
      pageSize: 20,
      sort: [{ field: 'updatedAt', direction: 'desc' }],
      filters: [
        ...(query ? [{ field: 'claimNumber', operator: 'contains' as const, value: query }] : []),
        ...(status ? [{ field: 'status', operator: 'eq' as const, value: status }] : []),
        ...(segment ? [{ field: 'segment', operator: 'eq' as const, value: segment }] : []),
      ],
    };
  }, [viewState]);

  function update(next: ClaimsSearchUpdate) {
    const params = new URLSearchParams(searchParams);

    if (next.page !== undefined) {
      params.set('page', String(next.page));
    }

    if (next.query !== undefined) {
      if (next.query) {
        params.set('query', next.query);
      } else {
        params.delete('query');
      }
    }

    if (next.status !== undefined) {
      if (next.status) {
        params.set('status', next.status);
      } else {
        params.delete('status');
      }
    }

    if (next.segment !== undefined) {
      if (next.segment) {
        params.set('segment', next.segment);
      } else {
        params.delete('segment');
      }
    }

    setSearchParams(params);
  }

  return [request, viewState, update];
}
