import { useParams } from 'react-router-dom';
import { ErrorState } from '../components/ErrorState';
import { DocumentWorkspacePage } from '../features/document-workspace/DocumentWorkspacePage';

export function DocumentWorkspaceRoute() {
  const { claimId, documentId } = useParams();

  if (!claimId || !documentId) {
    return <ErrorState message="The document route is missing a claim or document identifier." />;
  }

  return <DocumentWorkspacePage claimId={claimId} documentId={documentId} />;
}
