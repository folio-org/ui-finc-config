import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import source from '../../test/fixtures/metadatasource';
import renderWithIntlConfiguration from '../../test/jest/helpers/renderWithIntlConfiguration';
import SourceViewRoute from './SourceViewRoute';

const routeProps = {
  history: {
    action: 'PUSH',
    block: jest.fn(),
    createHref: jest.fn(),
    go: jest.fn(),
    listen: jest.fn(),
    location: {
      hash: '',
      pathname: '',
      search: '',
    },
    push: () => jest.fn(),
    replace: () => jest.fn(),
  },
  location: {
    hash: '',
    pathname: '',
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

describe('render SourceViewRoute', () => {
  it('should render the details-id', async () => {
    useOkapiKy.mockReturnValue({
      get: jest.fn(() => ({ json: () => source })),
    });

    renderWithIntlConfiguration(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SourceViewRoute
            {...routeProps}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => expect(document.querySelector('#pane-sourcedetails')).toBeInTheDocument());
  });
});
