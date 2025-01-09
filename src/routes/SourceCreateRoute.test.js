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
import SourceCreateRoute from './SourceCreateRoute';

const queryClient = new QueryClient();

jest.mock('../components/MetadataSources/MetadataSourceForm', () => () => <div>MetadataSourceForm</div>);

describe('render SourceCreateRoute', () => {
  it('should render MetadataSourceForm', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SourceCreateRoute {...routeProps} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText('MetadataSourceForm')).toBeInTheDocument();
  });
});
