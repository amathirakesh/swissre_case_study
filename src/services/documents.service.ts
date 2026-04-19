import { DocumentManifest } from '../types/documents';
import { http } from './http';

export const documentsService = {
  getManifest(documentId: string) {
    return http<DocumentManifest>(`/api/documents/${documentId}/manifest`);
  },
};
