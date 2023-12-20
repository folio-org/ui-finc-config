import React from 'react';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { StripesContext, useStripes } from '@folio/stripes/core';

import withIntlConfiguration from '../../../test/jest/helpers/withIntlConfiguration';
import FincNavigation from './FincNavigation';

const renderFincNavigation = (stripes) => (
  render(withIntlConfiguration(
    <StripesContext.Provider value={stripes}>
      <FincNavigation
        id="metadata-sources"
      />
    </StripesContext.Provider>
  ))
);

jest.unmock('react-intl');

describe('Finc Navigation', () => {
  describe('rendering with permissions', () => {
    let stripes;
    beforeEach(() => {
      stripes = useStripes();
      stripes.hasPerm = () => true;
      renderFincNavigation(stripes);
    });

    it('should not disable buttons', () => {
      const sourcesButton = screen.getByRole('button', { name: 'Sources' });
      const collectionsButton = screen.getByRole('button', { name: 'Collections' });
      expect(sourcesButton).not.toBeDisabled();
      expect(collectionsButton).not.toBeDisabled();
    });
  });

  describe('rendering without permissions', () => {
    let stripes;
    beforeEach(() => {
      stripes = useStripes();
      stripes.hasPerm = () => false;
      renderFincNavigation(stripes);
    });

    it('should disable buttons', () => {
      const sourcesButton = screen.getByRole('button', { name: 'Sources' });
      const collectionsButton = screen.getByRole('button', { name: 'Collections' });
      expect(sourcesButton).toBeDisabled();
      expect(collectionsButton).toBeDisabled();
    });
  });
});
