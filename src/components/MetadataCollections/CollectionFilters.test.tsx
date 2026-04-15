import React from 'react';

import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import {
  StripesContext,
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
  stripes: any,
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
  let stripes: any;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    stripes = useStripes();
  });

  describe('filter accordions', () => {
    it('renders all filter accordions', () => {
      renderCollectionFilters(stripes);

      expect(screen.getByText('Metadata source')).toBeInTheDocument();
      expect(screen.getByText('Metadata available')).toBeInTheDocument();
      expect(screen.getByText('Usage restricted')).toBeInTheDocument();
      expect(screen.getByText('Free content')).toBeInTheDocument();
    });
  });

  describe('mdSource filter', () => {
    it('renders mdSource options from filterData', async () => {
      renderCollectionFilters(stripes);

      await userEvent.click(document.querySelector('#mdSource-filter'));

      expect(await screen.findByText('Cambridge University Press Journals')).toBeInTheDocument();
      expect(screen.getByText('Oxford Scholarship Online')).toBeInTheDocument();
    });
  });
});
