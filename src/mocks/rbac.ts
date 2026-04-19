import { ClaimAction, ClaimRow } from '../types/claims';
import { DocumentPermissions } from '../types/documents';
import { DemoRole, DemoPolicySet } from '../types/rbac';

export const roleLabels: Record<DemoRole, string> = {
  supervisor: 'Claims Supervisor',
  adjuster: 'Claims Adjuster',
  reviewer: 'Claims Examiner',
};

export const roleScopeDescriptions: Record<DemoRole, string> = {
  supervisor: 'Sees all claims in the portfolio and can assign, review, and perform operational document actions.',
  adjuster: 'Sees only claims assigned to the adjuster and works the claim file and document package.',
  reviewer: 'Reviews submitted claims for accuracy and compliance, with read, comment, and annotation-oriented access.',
};

export const demoPoliciesByRole: Record<DemoRole, DemoPolicySet> = {
  adjuster: {
    canEditClaim: true,
    canDeleteClaim: false,
    canAssignClaim: false,
    canOpenDocument: true,
    canAnnotate: true,
    canComment: true,
    canSplitDocument: true,
    canMergeDocument: false,
  },
  supervisor: {
    canEditClaim: true,
    canDeleteClaim: true,
    canAssignClaim: true,
    canOpenDocument: true,
    canAnnotate: true,
    canComment: true,
    canSplitDocument: true,
    canMergeDocument: true,
  },
  reviewer: {
    canEditClaim: false,
    canDeleteClaim: false,
    canAssignClaim: false,
    canOpenDocument: true,
    canAnnotate: true,
    canComment: true,
    canSplitDocument: false,
    canMergeDocument: false,
  },
};

export function getClaimSegment(claim: ClaimRow) {
  const numericId = Number(claim.id.replace('clm-', ''));
  const mod = numericId % 3;

  return mod === 1 ? 'enterprise' : mod === 2 ? 'commercial' : 'retail';
}

export function canViewClaim(role: DemoRole, claim: ClaimRow) {
  if (role === 'supervisor') {
    return true;
  }

  if (role === 'adjuster') {
    return claim.assignee === 'Priya Shah';
  }

  return claim.status === 'Review' || claim.status === 'Closed';
}

export function getAvailableClaimActions(role: DemoRole, claim: ClaimRow): ClaimAction[] {
  if (!canViewClaim(role, claim)) {
    return [];
  }

  if (role === 'supervisor') {
    const actions: ClaimAction[] = ['edit', 'assign', 'viewDocument'];

    if (claim.status === 'Closed') {
      actions.push('delete');
    }

    return actions;
  }

  if (role === 'adjuster') {
    return ['edit', 'viewDocument'];
  }

  return ['viewDocument'];
}

export function getDocumentPermissions(role: DemoRole): DocumentPermissions {
  if (role === 'supervisor') {
    return {
      canAnnotate: true,
      canComment: true,
      canSplit: true,
      canMerge: true,
      canDelete: true,
    };
  }

  if (role === 'adjuster') {
    return {
      canAnnotate: true,
      canComment: true,
      canSplit: true,
      canMerge: false,
      canDelete: false,
    };
  }

  return {
    canAnnotate: true,
    canComment: true,
    canSplit: false,
    canMerge: false,
    canDelete: false,
  };
}

export function readDemoRole(headerValue: string | null): DemoRole {
  if (headerValue === 'adjuster' || headerValue === 'reviewer' || headerValue === 'supervisor') {
    return headerValue;
  }

  return 'supervisor';
}
