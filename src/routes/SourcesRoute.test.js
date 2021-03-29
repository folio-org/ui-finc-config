import { noop } from 'lodash';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import '../../test/jest/__mock__';
import renderWithIntl from '../../test/jest/helpers/renderWithIntl';
import translationsProperties from '../../test/jest/helpers';
import sources from '../../test/fixtures/metadatasources';
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
  resources: { sources }
};

describe('SourcesRoute', () => {
  describe('rendering the route with permissions', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <SourcesRoute {...routeProps} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the sources component', () => {
      const { getByTestId } = renderComponent;
      expect(getByTestId('sources')).toBeInTheDocument();
    });
  });

  describe('rendering with no permissions', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <SourcesRoute
            {...routeProps}
            stripes={{ hasPerm: () => false }}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('displays the permission error', () => {
      const { getByText } = renderComponent;
      expect(getByText('Permission error')).toBeInTheDocument();
    });
  });
});
