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
import CollectionEditRoute from './CollectionEditRoute';

const queryClient = new QueryClient();

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn().mockReturnValue({}),
  useMutation: jest.fn().mockReturnValue({}),
}));

jest.mock('../components/MetadataCollections/MetadataCollectionForm', () => () => <div>MetadataCollectionForm</div>);

describe('render CollectionEditRoute', () => {
  it('should render MetadataCollectionForm', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CollectionEditRoute {...routeProps} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText('MetadataCollectionForm')).toBeInTheDocument();
  });
});
