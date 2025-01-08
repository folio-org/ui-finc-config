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

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn().mockReturnValue({}),
  useMutation: jest.fn().mockReturnValue({}),
}));

jest.mock('../components/MetadataCollections/MetadataCollectionView', () => () => <div>MetadataCollectionView</div>);

describe('render CollectionViewRoute', () => {
  useOkapiKy.mockReturnValue({
    get: jest.fn(() => ({ json: () => metadatacollection })),
  });

  it('should render MetadataCollectionView', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CollectionViewRoute
            stripes={{ user: { perms: 'finc-config.metadata-collections.item.put' } }}
            {...routeProps}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText('MetadataCollectionView')).toBeInTheDocument();
  });
});
