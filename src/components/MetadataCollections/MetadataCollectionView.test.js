// import { noop } from 'lodash';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { StripesContext } from '@folio/stripes-core/src/StripesContext';

import '../../../test/jest/__mock__';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import renderWithIntl from '../../../test/jest/helpers';
import COLLECTION from '../../../test/fixtures/metadatacollection';
import MetadataCollectionView from './MetadataCollectionView';
import stripes from '../../../test/jest/__mock__/stripesCore.mock';

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

const renderMetadateCollectionView = (fakeStripes = stripes, record = COLLECTION) => (
  renderWithIntl(
    <MemoryRouter>
      <StripesContext.Provider value={fakeStripes}>
        <MetadataCollectionView
          canEdit
          handlers={handlers}
          isLoading={false}
          record={record}
        />
      </StripesContext.Provider>
    </MemoryRouter>,
    translationsProperties
  )
);

describe('MetadataCollectionView', () => {
  beforeEach(() => {
    renderMetadateCollectionView(stripes, COLLECTION);
  });

  it('edit button should be present', () => {
    expect(document.querySelector('#clickable-edit-collection')).toBeInTheDocument();
  });
  it('accordions should be present', () => {
    expect(document.querySelector('#managementAccordion')).toBeInTheDocument();
    expect(document.querySelector('#technicalAccordion')).toBeInTheDocument();
  });
  it('should display name', () => {
    expect(screen.getByLabelText('21st Century Political Science Association')).toBeInTheDocument();
  });
  it('should display description', () => {
    expect(screen.getByText('This is a test metadata collection 2')).toBeInTheDocument();
  });
  it('should display metadata source', () => {
    expect(screen.getByText('Early Music Online')).toBeInTheDocument();
  });
  it('should display LOD note', () => {
    expect(screen.getByText('Note for test publication')).toBeInTheDocument();
  });
  it('should display metadata available', () => {
    expect(screen.getByText('Metadata available')).toBeInTheDocument();
  });
});
