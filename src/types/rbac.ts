export type DemoRole = 'adjuster' | 'supervisor' | 'reviewer';

export interface DemoPolicySet {
  canEditClaim: boolean;
  canDeleteClaim: boolean;
  canAssignClaim: boolean;
  canOpenDocument: boolean;
  canAnnotate: boolean;
  canComment: boolean;
  canSplitDocument: boolean;
  canMergeDocument: boolean;
}
