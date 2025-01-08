import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import metadatasources from '../../test/fixtures/metadatasources';
import routeProps from '../../test/fixtures/routeProps';
import SourcesRoute from './SourcesRoute';

jest.mock('../components/MetadataSources/MetadataSources', () => () => <div>MetadataSources</div>);

describe('SourcesRoute', () => {
  describe('rendering with permissions', () => {
    it('should render MetadataSources', () => {
      render(
        <MemoryRouter>
          <SourcesRoute
            resources={{ metadatasources }}
            stripes={{ hasPerm: () => true, logger: { log: () => jest.fn() } }}
            {...routeProps}
          />
        </MemoryRouter>
      );

      expect(screen.getByText('MetadataSources')).toBeInTheDocument();
    });
  });

  describe('rendering without permissions', () => {
    it('should render the permission error', () => {
      render(
        <MemoryRouter>
          <SourcesRoute
            resources={{ metadatasources }}
            stripes={{ hasPerm: () => false, logger: { log: () => jest.fn() } }}
            {...routeProps}
          />
        </MemoryRouter>
      );

      expect(screen.queryByText('MetadataSources')).not.toBeInTheDocument();
      expect(screen.getByText('stripes-smart-components.permissionError')).toBeInTheDocument();
    });
  });
});
