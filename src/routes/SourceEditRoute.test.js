import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import routeProps from '../../test/fixtures/routeProps';
import SourceEditRoute from './SourceEditRoute';

const queryClient = new QueryClient();

useOkapiKy.mockReturnValue({
  get: jest.fn(() => ({ json: () => jest.fn() })),
});

jest.mock('../components/MetadataSources/MetadataSourceForm', () => () => <div>MetadataSourceForm</div>);

describe('render SourceEditRoute', () => {
  it('should render MetadataSourceForm', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SourceEditRoute {...routeProps} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await expect(screen.findByText('MetadataSourceForm')).resolves.toBeInTheDocument();
  });
});
