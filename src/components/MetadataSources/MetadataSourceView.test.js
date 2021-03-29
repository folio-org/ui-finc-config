import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { StripesContext } from '@folio/stripes-core/src/StripesContext';

import '../../../test/jest/__mock__';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import renderWithIntl from '../../../test/jest/helpers';
import SOURCE from '../../../test/fixtures/metadatasource';
import MetadataSourceView from './MetadataSourceView';
import stripes from '../../../test/jest/__mock__/stripesCore.mock';

const handlers = {
  onClose: jest.fn,
  onEdit: jest.fn,
};

const renderMetadataSourceView = (fakeStripes = stripes, record = SOURCE) => (
  renderWithIntl(
    <MemoryRouter>
      <StripesContext.Provider value={fakeStripes}>
        <MetadataSourceView
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

describe('MetadataSourceView', () => {
  beforeEach(() => {
    renderMetadataSourceView(stripes, SOURCE);
  });

  it('edit button should be present', () => {
    expect(document.querySelector('#clickable-edit-source')).toBeInTheDocument();
  });
  it('accordions should be present', () => {
    expect(document.querySelector('#managementAccordion')).toBeInTheDocument();
    expect(document.querySelector('#technicalAccordion')).toBeInTheDocument();
  });
  it('should display name', () => {
    expect(screen.getByLabelText('Cambridge University Press Journals')).toBeInTheDocument();
  });
  it('should display description', () => {
    expect(screen.getByText('Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore.')).toBeInTheDocument();
  });
  it('should display solr shard', () => {
    expect(screen.getByText('UBL main')).toBeInTheDocument();
  });
  it('should display status', () => {
    expect(screen.getByText('Implementation')).toBeInTheDocument();
  });
  test('should display button', async () => {
    expect(screen.getByText('Show all collections')).toBeInTheDocument();
  });
});
