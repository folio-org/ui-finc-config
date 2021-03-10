// import { noop } from 'lodash';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import { StripesContext } from '@folio/stripes-core/src/StripesContext';

import '../../../test/jest/__mock__';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import renderWithIntl from '../../../test/jest/helpers';
import SOURCE from '../../../test/fixtures/metadatasource';
import MetadataSourceView from './MetadataSourceView';
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
