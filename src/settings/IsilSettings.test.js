import React from 'react';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { ControlledVocab } from '@folio/stripes/smart-components';

import withIntlConfiguration from '../../test/jest/helpers/withIntlConfiguration';
import IsilSettings from './IsilSettings';

const renderIsilSettings = () => render(withIntlConfiguration(
  <IsilSettings
    stripes={{ connect: (Component) => Component, hasPerm: () => true }}
  />
));

jest.unmock('react-intl');

describe('IsilSettings', () => {
  beforeEach(() => {
    ControlledVocab.mockClear();
    renderIsilSettings();
  });

  it('should render ConnectedControlledVocab component', async () => {
    expect(ControlledVocab).toHaveBeenCalled();
  });

  it('should render correct label', async () => {
    expect(screen.getByText('Isils')).toBeInTheDocument();
  });
});
