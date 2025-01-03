import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';

import renderWithIntlConfiguration from '../../test/jest/helpers/renderWithIntlConfiguration';
import CollectionCreateRoute from './CollectionCreateRoute';

const routeProps = {
  history: {
    push: () => jest.fn(),
  },
  location: {
    search: '',
  },
};

const queryClient = new QueryClient();

jest.unmock('react-intl');

describe('render CollectionCreateRoute', () => {
  it('should render form-id and create-title', () => {
    renderWithIntlConfiguration(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CollectionCreateRoute {...routeProps} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(document.querySelector('#form-collection')).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
  });
});
