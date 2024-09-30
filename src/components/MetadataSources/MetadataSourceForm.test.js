import { MemoryRouter } from 'react-router-dom';
import { Form } from 'react-final-form';

import { render, screen, within } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { StripesContext, useStripes } from '@folio/stripes/core';

import withIntlConfiguration from '../../../test/jest/helpers/withIntlConfiguration';
import MetadataSourceForm from './MetadataSourceForm';
import SOURCE from '../../../test/fixtures/metadatasource';

const onDelete = jest.fn();
const onClose = jest.fn();
const handleSubmit = jest.fn();
const onSubmit = jest.fn();

const renderEmptyMetadataSourceForm = (stripes, initialValues = {}) => {
  return render(withIntlConfiguration(
    <StripesContext.Provider value={stripes}>
      <MemoryRouter>
        <Form
          onSubmit={jest.fn}
          render={() => (
            <MetadataSourceForm
              initialValues={initialValues}
              handlers={{ onClose, onDelete }}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
            />
          )}
        />
      </MemoryRouter>
    </StripesContext.Provider>
  ));
};

const renderMetadataSourceForm = (stripes, initialValues = SOURCE) => {
  return render(withIntlConfiguration(
    <StripesContext.Provider value={stripes}>
      <MemoryRouter>
        <Form
          onSubmit={jest.fn}
          render={() => (
            <MetadataSourceForm
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
  ));
};

jest.unmock('react-intl');

describe('MetadataSourceForm', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
  });

  describe('CREATE: empty form', () => {
    beforeEach(() => {
      renderEmptyMetadataSourceForm(stripes);
    });

    test('should display accordions', () => {
      expect(screen.getByRole('button', { name: 'Icon General' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Icon Management' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Icon Technical' })).toBeInTheDocument();
    });

    test('should display fields', () => {
      expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: 'Description' })).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: 'Implementation status' })).toBeInTheDocument();
    });

    test('if select solr shard and save is showing required fields', async () => {
      await userEvent.selectOptions(screen.getByRole('combobox', { name: /Solr shard/ }), 'UBL main');
      await userEvent.click(screen.getByRole('button', { name: 'Save & close' }));
      expect(screen.getAllByText(/required/i)).toHaveLength(3);
      expect(screen.getAllByText('Required!', { exact: true })).toHaveLength(2);
      expect(screen.getByText('Integer required!')).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('EDIT: form with initial values', () => {
    beforeEach(() => {
      renderMetadataSourceForm(stripes);
    });

    test('label should have value of fixture source', () => {
      expect(screen.getByDisplayValue('Cambridge University Press Journals')).toBeInTheDocument();
    });

    test('if change solr shard and click save is calling onSubmit function', async () => {
      await userEvent.selectOptions(screen.getByRole('combobox', { name: /Solr shard/ }), 'UBL ai');
      await userEvent.click(screen.getByRole('button', { name: 'Save & close' }));
      expect(onSubmit).toHaveBeenCalled();
    });
  });

  describe('delete source', () => {
    beforeEach(() => {
      renderMetadataSourceForm(stripes);
    });

    test('delete modal is present', async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
      const confirmationModal = screen.getByRole('dialog', { name: /Do you really want to delete Cambridge University Press Journals?/ });
      expect(confirmationModal).toBeInTheDocument();
    });

    test('click cancel', async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
      const confirmationModal = screen.getByRole('dialog', { name: /Do you really want to delete Cambridge University Press Journals?/ });

      const cancelButton = within(confirmationModal).getByRole('button', { name: 'Cancel' });
      await userEvent.click(cancelButton);
      expect(onDelete).not.toHaveBeenCalled();
    });

    test('click submit', async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
      const confirmationModal = screen.getByRole('dialog', { name: /Do you really want to delete Cambridge University Press Journals?/ });

      const submitButton = within(confirmationModal).getByRole('button', { name: 'Submit' });
      await userEvent.click(submitButton);
      expect(onDelete).toHaveBeenCalled();
    });
  });
});
