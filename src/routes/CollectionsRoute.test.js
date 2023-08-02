import { noop } from 'lodash';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@folio/jest-config-stripes/testing-library/react';

import withIntlConfiguration from '../../test/jest/helpers/withIntlConfiguration';
import collections from '../../test/fixtures/metadatacollections';
import CollectionsRoute from './CollectionsRoute';

const routeProps = {
  history: {
    push: () => jest.fn()
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
  resources: { collections }
};

jest.unmock('react-intl');

describe('CollectionsRoute', () => {
  describe('rendering the route with permissions', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = render(withIntlConfiguration(
        <MemoryRouter>
          <CollectionsRoute {...routeProps} />
        </MemoryRouter>
      ));
    });

    test('renders the collections component', () => {
      const { getByTestId } = renderComponent;
      expect(getByTestId('collections')).toBeInTheDocument();
    });
  });

  describe('rendering with no permissions', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = render(withIntlConfiguration(
        <MemoryRouter>
          <CollectionsRoute
            {...routeProps}
            stripes={{ hasPerm: () => false }}
          />
        </MemoryRouter>
      ));
    });

    test('displays the permission error', () => {
      const { getByText } = renderComponent;
      expect(getByText('Permission error')).toBeInTheDocument();
    });
  });
});
