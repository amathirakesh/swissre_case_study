import { screen } from '@testing-library/react';
import { AppLayout } from './AppLayout';
import { renderWithProviders } from '../../test/test-utils';

describe('AppLayout', () => {
  it('renders navigation shell content', () => {
    renderWithProviders(
      <AppLayout>
        <div>Body content</div>
      </AppLayout>,
    );

    expect(screen.getByText('Claims Operations')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });
});
