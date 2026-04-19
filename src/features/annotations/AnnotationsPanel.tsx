import { LoadingState } from '../../components/LoadingState';
import { Annotation } from '../../types/annotations';

interface AnnotationsPanelProps {
  annotations: Annotation[];
  isLoading: boolean;
}

export function AnnotationsPanel({ annotations, isLoading }: AnnotationsPanelProps) {
  if (isLoading) {
    return <LoadingState title="Loading annotations" message="Preparing annotation overlays and page metadata without blocking the workspace shell." />;
  }

  return (
    <div className="card workspace-panel">
      <h3 className="section-title">Annotations Panel</h3>
      <p className="section-copy">Placeholder surface for page overlays, geometry, and future Web Worker-assisted interactions.</p>
      <ul className="list">
        {annotations.map((annotation) => (
          <li className="list-item" key={annotation.id}>
            <strong>
              {annotation.type} on page {annotation.pageNumber}
            </strong>
            <div>{annotation.text}</div>
            <small>{annotation.createdBy}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
