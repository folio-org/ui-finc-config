import { MemoryRouter } from 'react-router-dom';
import { Form } from 'react-final-form';

import { screen, within } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { StripesContext, useStripes } from '@folio/stripes/core';

import renderWithIntlConfiguration from '../../../test/jest/helpers/renderWithIntlConfiguration';
import MetadataCollectionForm from './MetadataCollectionForm';
import COLLECTION from '../../../test/fixtures/metadatacollection';

const onDelete = jest.fn();
const onClose = jest.fn();
const handleSubmit = jest.fn();
const onSubmit = jest.fn();

const renderEmptyMetadataCollectionForm = (stripes, initialValues = { solrMegaCollections: [''] }) => {
  return renderWithIntlConfiguration(
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

const renderMetadataCollectionForm = (stripes, initialValues = COLLECTION) => {
  return renderWithIntlConfiguration(
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

jest.unmock('react-intl');

describe('MetadataCollectionForm', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
  });

  describe('CREATE: empty form', () => {
    beforeEach(() => {
      renderEmptyMetadataCollectionForm(stripes);
    });

    test('should display accordions', () => {
      expect(screen.getByRole('button', { name: 'Icon General' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Icon Management' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Icon Technical' })).toBeInTheDocument();
    });

    test('should display all fields', () => {
      expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: 'Description' })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Please add a metadata source')).toBeInTheDocument();
    });

    test('if select metadata available and click save is showing required fields', async () => {
      await userEvent.selectOptions(screen.getByRole('combobox', { name: /Metadata available/ }), 'yes');
      await userEvent.click(screen.getByRole('button', { name: 'Save & close' }));
      expect(screen.getAllByText('Required!').length).toEqual(4);
      expect(screen.getByText('Metadata source required!')).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    });

    test('permittedFor textField should NOT be visible', async () => {
      expect(screen.queryByRole('textbox', { name: /Permitted for/ })).not.toBeInTheDocument();
    });

    test('if select usageRestricted is adding permittedFor textField', async () => {
      await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Usage restricted' }), 'yes');
      expect(screen.getByPlaceholderText('Enter one ISIL for an insititution with permitted metadata usage')).toBeInTheDocument();
    });
  });

  describe('EDIT: form with initial values', () => {
    beforeEach(() => {
      renderMetadataCollectionForm(stripes);
    });

    test('description should have value of fixture collection', () => {
      expect(screen.getByDisplayValue('This is a test metadata collection 2')).toBeInTheDocument();
    });

    test('if select metadata available and click save is calling onSubmit function', async () => {
      await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Metadata available' }), 'no');
      await userEvent.click(screen.getByRole('button', { name: 'Save & close' }));
      expect(onSubmit).toHaveBeenCalled();
    });

    test('permittedFor fields should be visible', async () => {
      expect(document.getElementById('permittedFor[0]')).toBeInTheDocument();
      expect(document.getElementById('permittedFor[1]')).toBeInTheDocument();
    });

    test('if select usageRestricted is clearing permittedFor', async () => {
      await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Usage restricted' }), 'no');

      const confirmationModal = screen.getByRole('dialog', { name: /Do you want to clear permitted for when changing usage restricted?/ });
      expect(confirmationModal).toBeInTheDocument();

      expect(within(confirmationModal).getByRole('heading', { name: 'Clear permitted for?' })).toBeInTheDocument();
      const clearButton = within(confirmationModal).getByRole('button', { name: 'Clear permitted for' });
      await userEvent.click(clearButton);
      expect(document.getElementById('permittedFor[0]')).not.toBeInTheDocument();
    });
  });

  describe('delete collection', () => {
    beforeEach(() => {
      renderMetadataCollectionForm(stripes);
    });

    test('delete modal is present', async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
      const confirmationModal = screen.getByRole('dialog', { name: /Do you really want to delete 21st Century Political Science Association?/ });
      expect(confirmationModal).toBeInTheDocument();
    });

    test('click cancel', async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
      const confirmationModal = screen.getByRole('dialog', { name: /Do you really want to delete 21st Century Political Science Association?/ });
      const cancelButton = within(confirmationModal).getByRole('button', { name: 'Cancel' });
      await userEvent.click(cancelButton);
      expect(onDelete).not.toHaveBeenCalled();
    });

    test('click submit', async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
      const confirmationModal = screen.getByRole('dialog', { name: /Do you really want to delete 21st Century Political Science Association?/ });
      const submitButton = within(confirmationModal).getByRole('button', { name: 'Submit' });
      await userEvent.click(submitButton);
      expect(onDelete).toHaveBeenCalled();
    });
  });
});
