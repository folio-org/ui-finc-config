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

import mdSources from '../../../test/fixtures/tinyMetadataSources';
import renderWithIntlConfiguration from '../../../test/jest/helpers/renderWithIntlConfiguration';
import CollectionFilters from './CollectionFilters';

jest.unmock('react-intl');

const tinySources = { mdSources };

const activeFilters = {
  metadataAvailable: ['yes'],
  usageRestricted: [],
  freeContent: [],
  mdSource: [],
};

const filterHandlers = {
  clearGroup: jest.fn(),
  state: jest.fn(),
};

const renderCollectionFilters = (
  stripes: StripesType,
  props: Partial<React.ComponentProps<typeof CollectionFilters>> = {}
) => renderWithIntlConfiguration(
  <StripesContext.Provider value={stripes}>
    <CollectionFilters
      activeFilters={activeFilters}
      filterData={tinySources}
      filterHandlers={filterHandlers}
      {...props}
    />
  </StripesContext.Provider>
);

describe('CollectionFilters', () => {
  let stripes: StripesType;

  beforeEach(() => {
    jest.clearAllMocks();
    stripes = useStripes();
  });

  describe('filter accordions', () => {
    it('should render all filter accordions', () => {
      renderCollectionFilters(stripes);

      expect(screen.getByText('Metadata source')).toBeInTheDocument();
      expect(screen.getByText('Metadata available')).toBeInTheDocument();
      expect(screen.getByText('Usage restricted')).toBeInTheDocument();
      expect(screen.getByText('Free content')).toBeInTheDocument();
    });
  });

  describe('checkbox filters', () => {
    it('should show the selected values of a filter group', () => {
      renderCollectionFilters(stripes);

      const accordion = screen.getByRole('region', { name: 'Metadata available filter list' });
      expect(within(accordion).getByRole('checkbox', { name: 'Yes' })).toBeChecked();
      expect(within(accordion).getByRole('checkbox', { name: 'No' })).not.toBeChecked();
    });

    it('should update the filter state when a checkbox is clicked', async () => {
      renderCollectionFilters(stripes);

      const accordion = screen.getByRole('region', { name: 'Usage restricted filter list' });
      await userEvent.click(within(accordion).getByRole('checkbox', { name: 'No' }));

      expect(filterHandlers.state).toHaveBeenCalledWith({ ...activeFilters, usageRestricted: ['no'] });
    });

    it('should clear a filter group with the clear button', async () => {
      renderCollectionFilters(stripes);

      await userEvent.click(screen.getByRole('button', { name: /Clear selected Metadata available filters/ }));

      expect(filterHandlers.clearGroup).toHaveBeenCalledWith('metadataAvailable');
    });

    it('should show no clear button for a filter group without selected values', () => {
      renderCollectionFilters(stripes);

      const accordion = screen.getByRole('region', { name: 'Usage restricted filter list' });
      expect(within(accordion).queryByRole('button', { name: /Clear selected/ })).not.toBeInTheDocument();
    });
  });

  describe('mdSource filter', () => {
    it('should render mdSource options from filterData', async () => {
      renderCollectionFilters(stripes);

      await userEvent.click(document.querySelector('#mdSource-filter')!);

      expect(await screen.findByText('Cambridge University Press Journals')).toBeInTheDocument();
      expect(screen.getByText('Oxford Scholarship Online')).toBeInTheDocument();
    });
  });
});
