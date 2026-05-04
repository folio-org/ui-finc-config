import React from 'react';

import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import {
  StripesContext,
  StripesType,
  useStripes,
} from '@folio/stripes/core';

import contacts from '../../../test/fixtures/tinyContacts';
import renderWithIntlConfiguration from '../../../test/jest/helpers/renderWithIntlConfiguration';
import SourceFilters from './SourceFilters';

jest.unmock('react-intl');

const tinyContacts = { contacts };

const activeFilters = {
  status: ['active', 'implementation'],
  solrShard: [],
  contact: [],
};

const filterHandlers = {
  clearGroup: jest.fn(),
  state: jest.fn(),
};

const renderSourceFilters = (
  stripes: StripesType,
  props: Partial<React.ComponentProps<typeof SourceFilters>> = {}
) => renderWithIntlConfiguration(
  <StripesContext.Provider value={stripes}>
    <SourceFilters
      activeFilters={activeFilters}
      filterData={tinyContacts}
      filterHandlers={filterHandlers}
      {...props}
    />
  </StripesContext.Provider>
);

describe('SourceFilters', () => {
  let stripes: StripesType;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    stripes = useStripes();
  });

  describe('filter accordions', () => {
    it('renders all filter accordions', () => {
      renderSourceFilters(stripes);

      expect(screen.getByText('Implementation status')).toBeInTheDocument();
      expect(screen.getByText('Solr shard')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });
  });

  describe('contacts filter', () => {
    it('renders contact options from filterData', async () => {
      renderSourceFilters(stripes);

      await userEvent.click(document.querySelector('#contact-filter')!);

      expect(screen.getByText('Doe, John')).toBeInTheDocument();
      expect(screen.getByText('Doe, Jane')).toBeInTheDocument();
    });
  });
});
