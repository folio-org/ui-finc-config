import React from 'react';
import { MemoryRouter } from 'react-router-dom';
// import { screen } from '@testing-library/react';
import { noop } from 'lodash';
import { StripesContext } from '@folio/stripes-core/src/StripesContext';

import '../../../test/jest/__mock__';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import renderWithIntl from '../../../test/jest/helpers';
import COLLECTION from '../../../test/fixtures/metadatacollection';
import MetadataCollectionView from './MetadataCollectionView';

const stripes = {
  clone: () => ({ ...stripes }),
  connect: Component => <Component />,
  config: {},
  hasInterface: () => true,
  hasPerm: jest.fn().mockReturnValue(true),
  logger: { log: noop },
  locale: 'en-US',
  okapi: {
    tenant: 'diku',
    url: 'https://folio-testing-okapi.dev.folio.org',
  },
  plugins: {},
  user: {
    perms: {},
    user: {
      id: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
      username: 'diku_admin',
    },
  },
  withOkapi: true,
};

// const metadata = {
//   createdDate: '2020-12-22T14:45:14.855+00:00',
//   createdByUserId: '01d830e9-3308-56e2-9f94-e9e7bd186307',
//   updatedDate: '2020-12-22T14:45:14.855+00:00',
//   updatedByUserId: '01d830e9-3308-56e2-9f94-e9e7bd186307'
// };

const handlers = {
  onClose: jest.fn,
  onEdit: jest.fn,
};

const renderMetadateCollectionView = (fakeStripes = stripes) => (
  renderWithIntl(
    <MemoryRouter>
      <StripesContext.Provider value={fakeStripes}>
        <MetadataCollectionView
          canEdit
          handlers={handlers}
          isLoading={false}
          record={COLLECTION}
        />
      </StripesContext.Provider>
    </MemoryRouter>,
    translationsProperties
  )
);

describe('MetadataCollectionView', () => {
  beforeEach(() => {
    renderMetadateCollectionView(stripes);
  });

  it('edit button should be present', () => {
    expect(document.querySelector('#clickable-edit-collection')).toBeInTheDocument();
  });
  it('accordions should be present', () => {
    expect(document.querySelector('#managementAccordion')).toBeInTheDocument();
    expect(document.querySelector('#technicalAccordion')).toBeInTheDocument();
  });
});
