import { useQuery } from '@tanstack/react-query';
import { ChangeEvent, KeyboardEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import { LoadingState } from '../../components/LoadingState';
import { ServerDataGrid } from '../../components/ServerDataGrid';
import { useClaimsSearchParams } from '../../hooks/useClaimsSearchParams';
import { claimsService } from '../../services/claims.service';
import { useUiStore } from '../../store/ui-store';
import { ClaimRow } from '../../types/claims';

export function ClaimsListPage() {
  const navigate = useNavigate();
  const [request, viewState, updateSearch] = useClaimsSearchParams();
  const setSelectedClaimId = useUiStore((state) => state.setSelectedClaimId);
  const policies = useUiStore((state) => state.getActivePolicies());
  const [draftQuery, setDraftQuery] = useState(viewState.query);
  const [draftStatus, setDraftStatus] = useState(viewState.status);
  const [draftSegment, setDraftSegment] = useState(viewState.segment);

  const claimsQuery = useQuery({
    queryKey: ['claims', request],
    queryFn: () => claimsService.search(request),
    placeholderData: (previousData) => previousData,
  });

  const metrics = useMemo(() => {
    const rows = claimsQuery.data?.items ?? [];
    const openCount = rows.filter((row) => row.status === 'Open').length;
    const reviewCount = rows.filter((row) => row.status === 'Review').length;
    const assignedCount = rows.filter((row) => row.status === 'Assigned').length;

    return [
      { label: 'Total claims', value: '20.3k', tone: 'neutral' },
      { label: 'Open queue', value: String(openCount), tone: 'blue' },
      { label: 'In review', value: String(reviewCount), tone: 'amber' },
      { label: 'Assigned', value: String(assignedCount), tone: 'green' },
    ];
  }, [claimsQuery.data]);

  useEffect(() => {
    setDraftQuery(viewState.query);
    setDraftStatus(viewState.status);
    setDraftSegment(viewState.segment);
  }, [viewState.query, viewState.status, viewState.segment]);

  function applyFilters() {
    updateSearch({
      page: 1,
      query: draftQuery.trim(),
      status: draftStatus,
      segment: draftSegment,
    });
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      applyFilters();
    }
  }

  function handleStatusChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextStatus = event.target.value;
    setDraftStatus(nextStatus);
    updateSearch({ page: 1, status: nextStatus });
  }

  function handleSegmentChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextSegment = event.target.value;
    setDraftSegment(nextSegment);
    updateSearch({ page: 1, segment: nextSegment });
  }

  const columns = [
    {
      id: 'claimNumber',
      header: 'Claim',
      render: (row: ClaimRow) => (
        <div>
          <strong>{row.claimNumber}</strong>
          <div>{row.policyNumber}</div>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      render: (row: ClaimRow) => <span className="status-pill">{row.status}</span>,
    },
    {
      id: 'assignee',
      header: 'Assignee',
      render: (row: ClaimRow) => row.assignee,
    },
    {
      id: 'updatedAt',
      header: 'Updated',
      render: (row: ClaimRow) => new Date(row.updatedAt).toLocaleString(),
    },
    {
      id: 'actions',
      header: 'Actions',
      render: (row: ClaimRow) => {
        const canEdit = row.availableActions.includes('edit');
        const canAssign = row.availableActions.includes('assign');
        const canDelete = row.availableActions.includes('delete');
        const canOpen = row.availableActions.includes('viewDocument');

        return (
          <div className="grid-actions">
            {policies.canEditClaim ? (
              <button className="button button--secondary" type="button" disabled={!canEdit}>
                Edit
              </button>
            ) : null}
            {policies.canAssignClaim ? (
              <button className="button button--secondary" type="button" disabled={!canAssign}>
                Assign
              </button>
            ) : null}
            {policies.canDeleteClaim ? (
              <button className="button button--secondary" type="button" disabled={!canDelete}>
                Delete
              </button>
            ) : null}
            {policies.canOpenDocument ? (
              <button
                className="button"
                type="button"
                disabled={!canOpen}
                onClick={() => {
                  setSelectedClaimId(row.id);
                  navigate(`/claims/${row.id}/documents/${row.documentId}`);
                }}
              >
                Open
              </button>
            ) : null}
          </div>
        );
      },
    },
  ];

  return (
    <section className="section">
      <div className="section-header">
        <div>
          <h1 className="section-title">Claims List</h1>
          <p className="section-copy">
            CRM-style dashboard treatment with server-driven search state, role-visible action controls, and a list optimized for large operational queues.
          </p>
        </div>
      </div>

      <div className="metric-grid">
        {metrics.map((metric) => (
          <div className={`card metric-card metric-card--${metric.tone}`} key={metric.label}>
            <div className="metric-card__label">{metric.label}</div>
            <div className="metric-card__value">{metric.value}</div>
          </div>
        ))}
      </div>

      <div className="card filter-card">
        <div className="toolbar" aria-label="Claims filters">
          <input
            aria-label="Search claim number"
            placeholder="Search claim number"
            value={draftQuery}
            onChange={(event) => setDraftQuery(event.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
          <select aria-label="Filter by status" value={draftStatus} onChange={handleStatusChange}>
            <option value="">All statuses</option>
            <option value="Open">Open</option>
            <option value="Review">Review</option>
            <option value="Assigned">Assigned</option>
            <option value="Closed">Closed</option>
          </select>
          <select aria-label="Filter by segment" value={draftSegment} onChange={handleSegmentChange}>
            <option value="enterprise">Enterprise</option>
            <option value="commercial">Commercial</option>
            <option value="retail">Retail</option>
          </select>
          <button className="button button--secondary" type="button" onClick={applyFilters}>
            Apply Filters
          </button>
        </div>
      </div>

      {claimsQuery.isLoading ? <LoadingState title="Loading claims" /> : null}
      {claimsQuery.isError ? (
        <ErrorState message={claimsQuery.error.message} onRetry={() => void claimsQuery.refetch()} />
      ) : null}
      {!claimsQuery.isLoading && !claimsQuery.isError && claimsQuery.data?.items.length === 0 ? (
        <EmptyState title="No claims found" message="Adjust the current filters or search for a different claim number." />
      ) : null}
      {claimsQuery.data ? (
        <ServerDataGrid
          columns={columns}
          rows={claimsQuery.data.items}
          total={claimsQuery.data.total}
          page={claimsQuery.data.page}
          pageSize={claimsQuery.data.pageSize}
          isFetching={claimsQuery.isFetching}
          onPageChange={(page) => updateSearch({ page })}
        />
      ) : null}
    </section>
  );
}
