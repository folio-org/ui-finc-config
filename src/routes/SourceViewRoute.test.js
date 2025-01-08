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

import metadatasource from '../../test/fixtures/metadatasource';
import routeProps from '../../test/fixtures/routeProps';
import SourceViewRoute from './SourceViewRoute';

const queryClient = new QueryClient();

jest.mock('../components/MetadataSources/MetadataSourceView', () => () => <div>MetadataSourceView</div>);

describe('render SourceViewRoute', () => {
  it('should render MetadataSourceView', async () => {
    useOkapiKy.mockReturnValue({
      get: jest.fn(() => ({ json: () => metadatasource })),
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SourceViewRoute
            {...routeProps}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await expect(screen.findByText('MetadataSourceView')).resolves.toBeInTheDocument();
  });
});
