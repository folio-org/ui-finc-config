import React from 'react';

import {
  screen,
  within,
} from '@folio/jest-config-stripes/testing-library/react';
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

  beforeEach(() => {
    jest.clearAllMocks();
    stripes = useStripes();
  });

  describe('filter accordions', () => {
    it('should render all filter accordions', () => {
      renderSourceFilters(stripes);

      expect(screen.getByText('Implementation status')).toBeInTheDocument();
      expect(screen.getByText('Solr shard')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });
  });

  describe('checkbox filters', () => {
    it('should show the selected values of a filter group', () => {
      renderSourceFilters(stripes);

      const accordion = screen.getByRole('region', { name: 'Implementation status filter list' });
      expect(within(accordion).getByRole('checkbox', { name: 'Active' })).toBeChecked();
      expect(within(accordion).getByRole('checkbox', { name: 'Implementation' })).toBeChecked();
      expect(within(accordion).getByRole('checkbox', { name: 'Closed' })).not.toBeChecked();
    });

    it('should update the filter state when a checkbox is clicked', async () => {
      renderSourceFilters(stripes);

      const accordion = screen.getByRole('region', { name: 'Implementation status filter list' });
      await userEvent.click(within(accordion).getByRole('checkbox', { name: 'Active' }));

      expect(filterHandlers.state).toHaveBeenCalledWith({ ...activeFilters, status: ['implementation'] });
    });

    it('should clear a filter group with the clear button', async () => {
      renderSourceFilters(stripes);

      await userEvent.click(screen.getByRole('button', { name: /Clear selected Implementation status filters/ }));

      expect(filterHandlers.clearGroup).toHaveBeenCalledWith('status');
    });

    it('should show no clear button for a filter group without selected values', () => {
      renderSourceFilters(stripes);

      const accordion = screen.getByRole('region', { name: 'Solr shard filter list' });
      expect(within(accordion).queryByRole('button', { name: /Clear selected/ })).not.toBeInTheDocument();
    });
  });

  describe('contacts filter', () => {
    it('should render contact options from filterData', async () => {
      renderSourceFilters(stripes);

      await userEvent.click(document.querySelector('#contact-filter')!);

      expect(screen.getByText('Doe, John')).toBeInTheDocument();
      expect(screen.getByText('Doe, Jane')).toBeInTheDocument();
    });
  });
});
