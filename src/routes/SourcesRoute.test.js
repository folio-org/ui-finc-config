import { MemoryRouter } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';

import sources from '../../test/fixtures/metadatasources';
import renderWithIntlConfiguration from '../../test/jest/helpers/renderWithIntlConfiguration';
import SourcesRoute from './SourcesRoute';

const routeProps = {
  history: {
    push: () => jest.fn(),
  },
  match: {
    params: {
      id: '6dd325f8-b1d5-4568-a0d7-aecf6b8d6697',
    },
  },
  location: {},
  mutator: {
    query: { update: jest.fn() },
  },
  resources: { sources },
};

jest.unmock('react-intl');

describe('SourcesRoute', () => {
  describe('rendering with permissions', () => {
    it('should render the sources component', () => {
      renderWithIntlConfiguration(
        <MemoryRouter>
          <SourcesRoute
            {...routeProps}
            stripes={{ hasPerm: () => true, logger: { log: () => jest.fn() } }}
          />
        </MemoryRouter>
      );

      expect(screen.getByTestId('sources')).toBeInTheDocument();
      expect(screen.getByText('Metadata sources')).toBeInTheDocument();
    });
  });

  describe('rendering without permissions', () => {
    it('should render the permission error', () => {
      renderWithIntlConfiguration(
        <MemoryRouter>
          <SourcesRoute
            {...routeProps}
            stripes={{ hasPerm: () => false, logger: { log: () => jest.fn() } }}
          />
        </MemoryRouter>
      );

      expect(screen.getByText('Permission error')).toBeInTheDocument();
    });
  });
});
