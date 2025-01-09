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
import SourceViewRoute from './SourceViewRoute';

const queryClient = new QueryClient();

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn().mockReturnValue({}),
  useMutation: jest.fn().mockReturnValue({}),
}));

jest.mock('../components/MetadataSources/MetadataSourceView', () => () => <div>MetadataSourceView</div>);

describe('render SourceViewRoute', () => {
  it('should render MetadataSourceView', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SourceViewRoute {...routeProps} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText('MetadataSourceView')).toBeInTheDocument();
  });
});
