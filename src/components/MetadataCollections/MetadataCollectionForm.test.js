// import { noop } from 'lodash';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Form } from 'react-final-form';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StripesContext } from '@folio/stripes-core/src/StripesContext';

import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import MetadataCollectionForm from './MetadataCollectionForm';
import COLLECTION from '../../../test/fixtures/metadatacollection';
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

const renderMetadataCollectionForm = (initialValues = COLLECTION) => {
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
  describe('create: empty form', () => {
    beforeEach(() => {
      renderEmptyMetadataCollectionForm();
    });
    test('should display accordion', () => {
      expect(document.querySelector('#editCollectionInfo')).toBeInTheDocument();
      expect(document.querySelector('#editCollectionManagement')).toBeInTheDocument();
      expect(document.querySelector('#editCollectionTechnical')).toBeInTheDocument();
    });

    test('should display all fields', () => {
      expect(document.querySelector('#addcollection_label')).toBeInTheDocument();
      expect(document.querySelector('#addcollection_description')).toBeInTheDocument();
      expect(document.querySelector('#addcollection_mdSource')).toBeInTheDocument();
    });

    describe('select Metadata available', () => {
      beforeEach(() => {
        userEvent.selectOptions(
          screen.getByLabelText('Metadata available'), ['yes']
        );
      });
      test('test required fields', async () => {
        userEvent.click(screen.getByText('Save & close'));
        // expect(screen.getAllByText('Required!')).toHaveLength(4);
        // expect(screen.getAllByText(/required/i)).toHaveLength(5);
        expect(screen.getAllByText('Required!', { exact: false })).toHaveLength(4);
        expect(screen.getAllByText('Metadata source required!')).toHaveLength(1);
      });
    });
    test('permittedFor textField should NOT be visible', async () => {
      expect(document.getElementById('permittedFor[0]')).not.toBeInTheDocument();
    });
    describe('select usageRestricted yes', () => {
      beforeEach(() => {
        userEvent.selectOptions(
          screen.getByLabelText('Usage restricted', { exact: false }), ['yes']
        );
      });
      test('permittedFor textField should be visible with placeholder', async () => {
        await waitFor(() => expect(document.getElementById('permittedFor[0]')).toBeInTheDocument());
        expect(screen.getByPlaceholderText('Enter one ISIL for an insititution with permitted metadata usage')).toBeInTheDocument();
      });
    });
  });
  describe('edit: form with initial values', () => {
    beforeEach(() => {
      renderMetadataCollectionForm();
    });
    test('description should have value of fixture collection', () => {
      expect(screen.getByDisplayValue('This is a test metadata collection 2')).toBeInTheDocument();
    });
  });
});
