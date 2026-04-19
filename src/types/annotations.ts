export interface Annotation {
  id: string;
  documentId: string;
  pageNumber: number;
  type: 'highlight' | 'note';
  text: string;
  createdBy: string;
}

export interface Comment {
  id: string;
  documentId: string;
  pageNumber: number;
  text: string;
  createdBy: string;
  createdAt: string;
}
