import { noop } from 'lodash';
import { MemoryRouter } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';

import collections from '../../test/fixtures/metadatacollections';
import renderWithIntlConfiguration from '../../test/jest/helpers/renderWithIntlConfiguration';
import CollectionsRoute from './CollectionsRoute';

const routeProps = {
  history: {
    push: () => jest.fn(),
  },
  match: {
    params: {
      id: '9a2427cd-4110-4bd9-b6f9-e3475631bbac',
    },
  },
  location: {},
  mutator: {
    query: { update: noop },
  },
  resources: { collections },
};

jest.unmock('react-intl');

describe('CollectionsRoute', () => {
  describe('rendering the route with permissions', () => {
    beforeEach(() => {
      renderWithIntlConfiguration(
        <MemoryRouter>
          <CollectionsRoute
            {...routeProps}
            stripes={{ hasPerm: () => true, logger: { log: () => jest.fn() } }}
          />
        </MemoryRouter>
      );
    });

    test('renders the collections component', () => {
      expect(screen.getByTestId('collections')).toBeInTheDocument();
    });
  });

  describe('rendering with no permissions', () => {
    beforeEach(() => {
      renderWithIntlConfiguration(
        <MemoryRouter>
          <CollectionsRoute
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
