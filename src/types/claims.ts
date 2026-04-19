export type ClaimStatus = 'Open' | 'Review' | 'Assigned' | 'Closed';
export type ClaimAction = 'edit' | 'delete' | 'assign' | 'viewDocument';

export interface ClaimRow {
  id: string;
  claimNumber: string;
  policyNumber: string;
  status: ClaimStatus;
  assignee: string;
  updatedAt: string;
  availableActions: ClaimAction[];
  documentId: string;
}

export interface SortDescriptor {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterDescriptor {
  field: string;
  operator: 'eq' | 'in' | 'contains';
  value: string | string[];
}

export interface ClaimsSearchRequest {
  page: number;
  pageSize: number;
  sort: SortDescriptor[];
  filters: FilterDescriptor[];
}

export interface ClaimsSearchResponse {
  items: ClaimRow[];
  page: number;
  pageSize: number;
  total: number;
}
