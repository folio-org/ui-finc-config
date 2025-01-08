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

import metadatacollection from '../../test/fixtures/metadatacollection';
import routeProps from '../../test/fixtures/routeProps';
import CollectionViewRoute from './CollectionViewRoute';

const queryClient = new QueryClient();

jest.mock('../components/MetadataCollections/MetadataCollectionView', () => () => <div>MetadataCollectionView</div>);

describe('render CollectionViewRoute', () => {
  useOkapiKy.mockReturnValue({
    get: jest.fn(() => ({ json: () => metadatacollection })),
  });

  it('should render MetadataCollectionView', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CollectionViewRoute
            {...routeProps}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await expect(screen.findByText('MetadataCollectionView')).resolves.toBeInTheDocument();
  });
});
