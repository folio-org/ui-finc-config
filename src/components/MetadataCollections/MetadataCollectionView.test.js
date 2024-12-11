import { MemoryRouter } from 'react-router-dom';
import { screen } from '@folio/jest-config-stripes/testing-library/react';

import { StripesContext, useStripes } from '@folio/stripes/core';

import renderWithIntlConfiguration from '../../../test/jest/helpers/renderWithIntlConfiguration';
import COLLECTION from '../../../test/fixtures/metadatacollection';
import MetadataCollectionView from './MetadataCollectionView';

const handlers = {
  onClose: jest.fn,
  onEdit: jest.fn,
};

const renderMetadataCollectionView = (stripes, record = COLLECTION) => renderWithIntlConfiguration(
  <MemoryRouter>
    <StripesContext.Provider value={stripes}>
      <MetadataCollectionView
        canEdit
        handlers={handlers}
        isLoading={false}
        record={record}
      />
    </StripesContext.Provider>
  </MemoryRouter>
);

jest.unmock('react-intl');

describe('MetadataCollectionView', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
    renderMetadataCollectionView(stripes, COLLECTION);
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
