import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';

import { ReactPracticePage } from './ReactPracticePage';

function renderPage() {
  globalThis.fetch = jest.fn(() => new Promise<Response>(() => undefined));

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ReactPracticePage />
    </QueryClientProvider>,
  );
}

describe('ReactPracticePage', () => {
  it('renders the learning page', () => {
    renderPage();

    expect(
      screen.getByRole('heading', { name: /Learn React by changing it/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('interactive exercises')).toBeInTheDocument();
  });

  it('updates the counter through a typed event handler', () => {
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: 'Increase count' }));

    expect(screen.getByText('1', { selector: 'output' })).toBeInTheDocument();
  });
});
