import { Annotation, Comment } from '../types/annotations';
import { http } from './http';

export const annotationsService = {
  getAnnotations(documentId: string) {
    return http<Annotation[]>(`/api/documents/${documentId}/annotations`);
  },
  getComments(documentId: string) {
    return http<Comment[]>(`/api/documents/${documentId}/comments`);
  },
};
