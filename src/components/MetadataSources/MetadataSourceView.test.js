import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { StripesContext, useStripes } from '@folio/stripes/core';

import withIntlConfiguration from '../../../test/jest/helpers/withIntlConfiguration';
import SOURCE from '../../../test/fixtures/metadatasource';
import MetadataSourceView from './MetadataSourceView';

const handlers = {
  onClose: jest.fn,
  onEdit: jest.fn,
};

const renderMetadataSourceView = (stripes, record = SOURCE) => (
  render(withIntlConfiguration(
    <MemoryRouter>
      <StripesContext.Provider value={stripes}>
        <MetadataSourceView
          canEdit
          handlers={handlers}
          isLoading={false}
          record={record}
        />
      </StripesContext.Provider>
    </MemoryRouter>
  ))
);

jest.unmock('react-intl');

describe('MetadataSourceView', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
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
