import React from 'react';
import { screen } from '@testing-library/react';

import { ControlledVocab } from '@folio/stripes/smart-components'; // StripesConnectedSource

// import fakeStripes from '../../test/jest/__mock__/stripesCore.mock';
// import Isils from '../../test/fixtures/isils';
import renderWithIntl from '../../test/jest/helpers';
import IsilSettings from './IsilSettings';
import translationsProperties from '../../test/jest/helpers/translationsProperties';

const fakeStripes = { connect: (Component) => Component, hasPerm: () => false };
const fakeMutator = { isils: {} };
const fakeResources = { isils: {} };

// const renderControlledVocab = (stripes = fakeStripes, mutator = fakeMutator, resources = fakeResources) => renderWithIntl(
//   <ControlledVocab
//     baseUrl="finc-config/isils"
//     label="Isils"
//     labelSingular="Isil"
//     objectLabel="Isil"
//     mutator={mutator}
//     resources={resources}
//     stripes={{ connect: (Component) => Component, hasPerm: () => true }}
//   />,
//   translationsProperties
// );

// const ConnectedControlledVocab = fakeStripes.connect(renderControlledVocab);

const renderIsilSettings = () => renderWithIntl(
  <IsilSettings
    stripes={{ connect: (Component) => Component, hasPerm: () => true }}
  />,
  translationsProperties
);

describe('IsilSettings', () => {
  beforeEach(() => {
    ControlledVocab.mockClear();
  });

  it('should render correct label', async () => {
    renderIsilSettings({ fakeStripes }, fakeMutator, fakeResources);

    expect(screen.getByText('Isils')).toBeInTheDocument();
  });
});
