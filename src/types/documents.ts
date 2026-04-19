export interface DocumentPermissions {
  canAnnotate: boolean;
  canComment: boolean;
  canSplit: boolean;
  canMerge: boolean;
  canDelete: boolean;
}

export interface DocumentPageManifest {
  pageNumber: number;
  thumbnailUrl: string;
  streamUrl: string;
  width: number;
  height: number;
}

export interface DocumentManifest {
  documentId: string;
  claimId: string;
  fileName: string;
  pageCount: number;
  version: string;
  permissions: DocumentPermissions;
  pages: DocumentPageManifest[];
}
