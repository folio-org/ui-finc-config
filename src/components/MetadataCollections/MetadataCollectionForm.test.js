// import { noop } from 'lodash';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Form } from 'react-final-form';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StripesContext } from '@folio/stripes-core/src/StripesContext';

import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import MetadataCollectionForm from './MetadataCollectionForm';
// import COLLECTION from '../../../test/fixtures/metadatacollection';
import stripes from '../../../test/jest/__mock__/stripesCore.mock';

const onDelete = jest.fn();
const onClose = jest.fn();
const handleSubmit = jest.fn();
const onSubmit = jest.fn();

const renderEmptyMetadataCollectionForm = (initialValues = {}) => {
  return renderWithIntl(
    <StripesContext.Provider value={stripes}>
      <MemoryRouter>
        <Form
          onSubmit={jest.fn}
          render={() => (
            <MetadataCollectionForm
              initialValues={initialValues}
              handlers={{ onClose, onDelete }}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
            />
          )}
        />
      </MemoryRouter>
    </StripesContext.Provider>
  );
};

describe('MetadataCollectionForm', () => {
  test('should display accordion', () => {
    renderEmptyMetadataCollectionForm();
    expect(document.querySelector('#editCollectionInfo')).toBeInTheDocument();
    expect(document.querySelector('#editCollectionManagement')).toBeInTheDocument();
    expect(document.querySelector('#editCollectionTechnical')).toBeInTheDocument();
    // userEvent.click(screen.getByText('Save & close'));
    // expect(getAllByText('Required!')).toHaveLength(1);
  });

  test('should display all fields', () => {
    renderEmptyMetadataCollectionForm();
    expect(document.querySelector('#addcollection_label')).toBeInTheDocument();
    expect(document.querySelector('#addcollection_description')).toBeInTheDocument();
    expect(document.querySelector('#addcollection_mdSource')).toBeInTheDocument();
  });

  describe('select Metadata available', () => {
    beforeEach(() => {
      renderEmptyMetadataCollectionForm();
      userEvent.selectOptions(
        screen.getByLabelText('Metadata available', { exact: false }), ['yes']
      );
    });
    test('test required fields', async () => {
      userEvent.click(screen.getByText('Save & close'));
      expect(screen.getAllByText('Required!', { exact: false })).toHaveLength(4);
      expect(screen.getAllByText('Metadata source required!', { exact: false })).toHaveLength(1);
    });
  });
});



// describe('MetadataCollectionForm', () => {
//   test('renders form', async () => {
//     renderEmptyMetadataCollectionForm(); display accordio
//     expect(screen.getByText('Metadata available')).toBeVisible();
//   });

//   beforeEach(() => {
//     renderEmptyMetadataCollectionForm(stripes);
//     userEvent.selectOptions(
//       screen.getByLabelText('Usage restricted', { exact: false }), ['yes']
//     );
//   });
//   test('permittedFor textField should be visible', async () => {
//     // expect(screen.getByPlaceholderText('Enter one ISIL for an insititution with permitted metadata usage')).toBeInTheDocument();
//     expect(document.getElementById('permittedFor[0]')).toBeInTheDocument();
//   });
// });

