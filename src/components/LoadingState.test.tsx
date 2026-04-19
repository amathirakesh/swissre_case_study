import { screen } from '@testing-library/react';
import { LoadingState } from './LoadingState';
import { renderWithProviders } from '../test/test-utils';

describe('LoadingState', () => {
  it('renders the provided loading copy', () => {
    renderWithProviders(<LoadingState title="Loading claims" message="Preparing indexed server results." />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading claims');
    expect(screen.getByText('Preparing indexed server results.')).toBeInTheDocument();
  });
});
