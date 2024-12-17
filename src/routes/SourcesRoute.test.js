import { noop } from 'lodash';
import { MemoryRouter } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';

import sources from '../../test/fixtures/metadatasources';
import renderWithIntlConfiguration from '../../test/jest/helpers/renderWithIntlConfiguration';
import SourcesRoute from './SourcesRoute';

const routeProps = {
  history: {
    push: () => jest.fn()
  },
  match: {
    params: {
      id: '6dd325f8-b1d5-4568-a0d7-aecf6b8d6697',
    },
  },
  location: {},
  mutator: {
    query: { update: noop },
  },
  resources: { sources },
};

jest.unmock('react-intl');

describe('SourcesRoute', () => {
  describe('rendering the route with permissions', () => {
    beforeEach(() => {
      renderWithIntlConfiguration(
        <MemoryRouter>
          <SourcesRoute
            {...routeProps}
            stripes={{ hasPerm: () => true, logger: { log: () => jest.fn() } }}
          />
        </MemoryRouter>
      );
    });

    test('renders the sources component', () => {
      expect(screen.getByTestId('sources')).toBeInTheDocument();
    });
  });

  describe('rendering with no permissions', () => {
    beforeEach(() => {
      renderWithIntlConfiguration(
        <MemoryRouter>
          <SourcesRoute
            {...routeProps}
            stripes={{ hasPerm: () => false, logger: { log: () => jest.fn() } }}
          />
        </MemoryRouter>
      );
    });

    test('displays the permission error', () => {
      expect(screen.getByText('Permission error')).toBeInTheDocument();
    });
  });
});
