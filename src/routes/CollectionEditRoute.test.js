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
import CollectionEditRoute from './CollectionEditRoute';

const queryClient = new QueryClient();

useOkapiKy.mockReturnValue({
  get: jest.fn(() => ({ json: () => jest.fn() })),
});

jest.mock('../components/MetadataCollections/MetadataCollectionForm', () => () => <div>MetadataCollectionForm</div>);

describe('render CollectionEditRoute', () => {
  it('should render MetadataCollectionForm', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CollectionEditRoute {...routeProps} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await expect(screen.findByText('MetadataCollectionForm')).resolves.toBeInTheDocument();
  });
});
