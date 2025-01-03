import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';

import renderWithIntlConfiguration from '../../test/jest/helpers/renderWithIntlConfiguration';
import SourceCreateRoute from './SourceCreateRoute';

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

describe('render SourceCreateRoute', () => {
  it('should render form-id and create-title', () => {
    renderWithIntlConfiguration(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SourceCreateRoute {...routeProps} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(document.querySelector('#form-source')).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
  });
});
