import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import renderWithIntlConfiguration from '../../test/jest/helpers/renderWithIntlConfiguration';
import SourceEditRoute from './SourceEditRoute';

const routeProps = {
  history: {
    push: () => jest.fn(),
  },
  location: {
    search: '',
  },
  match: {
    params: {
      id: '9a2427cd-4110-4bd9-b6f9-e3475631bbac',
    },
  },
};

const queryClient = new QueryClient();

jest.unmock('react-intl');

useOkapiKy.mockReturnValue({
  get: jest.fn(() => ({ json: () => jest.fn() })),
});

describe('render SourceEditRoute', () => {
  test('should render form-id', async () => {
    renderWithIntlConfiguration(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SourceEditRoute {...routeProps} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => expect(document.querySelector('#form-source')).toBeInTheDocument());
  });
});
