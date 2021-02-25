import React from 'react';
import { screen } from '@testing-library/react';
import { ControlledVocab } from '@folio/stripes/smart-components';

import fakeStripes from '../../test/jest/__mock__/stripesCore.mock';
import renderWithIntl from '../../test/jest/helpers';
import IsilSettings from './IsilSettings';
import translationsProperties from '../../test/jest/helpers/translationsProperties';
// import Isils from '../../test/fixtures/isils';

const renderIsilSettings = () => renderWithIntl(
  <IsilSettings
    stripes={{ connect: (Component) => Component, hasPerm: () => true }}
  />,
  translationsProperties
);

describe('IsilSettings', () => {
  beforeEach(() => {
    ControlledVocab.mockClear();
    renderIsilSettings({ fakeStripes });
  });

  it('should render ConnectedControlledVocab component', async () => {
    expect(ControlledVocab).toHaveBeenCalled();
  });

  it('should render correct label', async () => {
    expect(screen.getByText('Isils')).toBeInTheDocument();
  });
});
