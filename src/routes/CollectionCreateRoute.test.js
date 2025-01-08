import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import routeProps from '../../test/fixtures/routeProps';
import CollectionCreateRoute from './CollectionCreateRoute';

const queryClient = new QueryClient();

jest.mock('../components/MetadataCollections/MetadataCollectionForm', () => () => <div>MetadataCollectionForm</div>);

describe('render CollectionCreateRoute', () => {
  it('should render MetadataCollectionForm', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CollectionCreateRoute {...routeProps} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText('MetadataCollectionForm')).toBeInTheDocument();
  });
});
