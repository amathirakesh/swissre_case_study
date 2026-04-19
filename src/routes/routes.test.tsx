import { screen } from '@testing-library/react';
import { ClaimsListRoute } from './ClaimsListRoute';
import { DocumentWorkspaceRoute } from './DocumentWorkspaceRoute';
import { renderRoute } from '../test/test-utils';

describe('routes', () => {
  it('renders the claims list route', async () => {
    renderRoute(<ClaimsListRoute />, '/claims', '/claims');

    expect(await screen.findByText('Claims List')).toBeInTheDocument();
    expect(await screen.findByText(/20k\+ record set/i)).toBeInTheDocument();
  });

  it('renders the document workspace route', async () => {
    renderRoute(<DocumentWorkspaceRoute />, '/claims/:claimId/documents/:documentId', '/claims/clm-1001/documents/doc-1001');

    expect(await screen.findByText('Document Workspace')).toBeInTheDocument();
    expect(await screen.findByText(/Split \(Async Job\)/)).toBeInTheDocument();
  });
});
