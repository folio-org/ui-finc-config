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
              onDelete={onDelete}
            />
          )}
        />
      </MemoryRouter>
    </StripesContext.Provider>
  );
};

describe('MetadataCollectionForm', () => {
  describe('CREATE: empty form', () => {
    beforeEach(() => {
      renderEmptyMetadataCollectionForm();
    });
    test('should display accordions', () => {
      expect(document.querySelector('#editCollectionInfo')).toBeInTheDocument();
      expect(document.querySelector('#editCollectionManagement')).toBeInTheDocument();
      expect(document.querySelector('#editCollectionTechnical')).toBeInTheDocument();
    });

    test('should display all fields', () => {
      expect(document.querySelector('#addcollection_label')).toBeInTheDocument();
      expect(document.querySelector('#addcollection_description')).toBeInTheDocument();
      expect(document.querySelector('#addcollection_mdSource')).toBeInTheDocument();
    });

    describe('select metadata available', () => {
      beforeEach(() => {
        userEvent.selectOptions(
          screen.getByLabelText('Metadata available'), ['yes']
        );
      });
      test('test required fields', async () => {
        userEvent.click(screen.getByText('Save & close'));
        // TODO: Required! of RequiredRepeatableField is not considered yet
        // expect(screen.getAllByText('Required!')).toHaveLength(4);
        // expect(screen.getAllByText(/required/i)).toHaveLength(5);
        expect(screen.getAllByText('Required!', { exact: false })).toHaveLength(4);
        expect(screen.getAllByText('Metadata source required!')).toHaveLength(1);
        expect(onSubmit).not.toHaveBeenCalled();
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
      test('permittedFor textField should be visible', async () => {
        await waitFor(() => expect(document.getElementById('permittedFor[0]')).toBeInTheDocument());
        expect(screen.getByPlaceholderText('Enter one ISIL for an insititution with permitted metadata usage')).toBeInTheDocument();
      });
    });
  });

  describe('EDIT: form with initial values', () => {
    beforeEach(() => {
      renderMetadataCollectionForm();
    });
    test('description should have value of fixture collection', () => {
      expect(screen.getByDisplayValue('This is a test metadata collection 2')).toBeInTheDocument();
    });

    describe('select metadata available no', () => {
      beforeEach(() => {
        userEvent.selectOptions(
          screen.getByLabelText('Metadata available'), ['no']
        );
      });
      test('click save should call onSubmit function', async () => {
        userEvent.click(screen.getByText('Save & close'));
        expect(onSubmit).toHaveBeenCalled();
      });
    });

    test('permittedFor fields should be visible', async () => {
      expect(document.getElementById('permittedFor[0]')).toBeInTheDocument();
      expect(document.getElementById('permittedFor[1]')).toBeInTheDocument();
    });
    describe('select usageRestricted no', () => {
      beforeEach(() => {
        userEvent.selectOptions(
          screen.getByLabelText('Usage restricted', { exact: false }), ['no']
        );
      });
      test('clear permittedFor', async () => {
        expect(screen.getByText('Clear permitted for?')).toBeInTheDocument();
        expect(screen.getByText('Do you want to clear permitted for when changing usage restricted?')).toBeInTheDocument();
        userEvent.click(screen.getByText('Clear permitted for'));
        expect(document.getElementById('permittedFor[0]')).not.toBeInTheDocument();
      });
    });
  });

  describe('delete collection', () => {
    beforeEach(() => {
      renderMetadataCollectionForm();
    });

    test('delete modal is present', () => {
      userEvent.click(screen.getByText('Delete'));
      expect(document.getElementById('delete-collection-confirmation')).toBeInTheDocument();
      expect(screen.getByText('Do you really want to delete 21st Century Political Science Association?')).toBeInTheDocument();
    });

    test('click cancel', () => {
      userEvent.click(screen.getByText('Delete'));
      const cancel = screen.getByRole('button', {
        name: 'Cancel',
        id: 'clickable-delete-collection-confirmation-cancel',
      });
      userEvent.click(cancel);
      expect(onDelete).not.toHaveBeenCalled();
    });

    test('click submit', () => {
      userEvent.click(screen.getByText('Delete'));
      const submit = screen.getByRole('button', {
        name: 'Submit',
        id: 'clickable-delete-collection-confirmation-confirm',
      });
      userEvent.click(submit);
      expect(onDelete).toHaveBeenCalled();
    });
  });
});
