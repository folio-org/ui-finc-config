import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { ControlledVocab } from '@folio/stripes/smart-components';

import renderWithIntlConfiguration from '../../test/jest/helpers/renderWithIntlConfiguration';
import IsilSettings from './IsilSettings';

const renderIsilSettings = () => renderWithIntlConfiguration(
  <IsilSettings stripes={{ connect: (Component) => Component, hasPerm: () => true }} />
);

jest.unmock('react-intl');
jest.mock('@folio/stripes/smart-components', () => ({
  ControlledVocab: jest.fn(({ label }) => (
    <span>{label}</span>
  )),
}));

describe('IsilSettings', () => {
  beforeEach(() => {
    renderIsilSettings();
  });

  it('should render ConnectedControlledVocab component', async () => {
    expect(ControlledVocab).toHaveBeenCalled();
  });

  it('should render correct label', async () => {
    expect(screen.getByText('Isils')).toBeInTheDocument();
  });
});
