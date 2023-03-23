import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Form } from 'react-final-form';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StripesContext } from '@folio/stripes/core';

import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import MetadataSourceForm from './MetadataSourceForm';
import SOURCE from '../../../test/fixtures/metadatasource';
import stripes from '../../../test/jest/__mock__/stripesCore.mock';

const onDelete = jest.fn();
const onClose = jest.fn();
const handleSubmit = jest.fn();
const onSubmit = jest.fn();

const renderEmptyMetadataSourceForm = (initialValues = {}) => {
  return renderWithIntl(
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
  );
};

const renderMetadataSourceForm = (initialValues = SOURCE) => {
  return renderWithIntl(
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
  );
};

describe('MetadataSourceForm', () => {
  describe('CREATE: empty form', () => {
    beforeEach(() => {
      renderEmptyMetadataSourceForm();
    });
    test('should display accordions', () => {
      expect(document.querySelector('#editSourceInfo')).toBeInTheDocument();
      expect(document.querySelector('#editSourceManagement')).toBeInTheDocument();
      expect(document.querySelector('#editSourceTechnical')).toBeInTheDocument();
    });

    test('should display fields', () => {
      expect(document.querySelector('#addsource_label')).toBeInTheDocument();
      expect(document.querySelector('#addsource_description')).toBeInTheDocument();
      expect(document.querySelector('#addsource_status')).toBeInTheDocument();
    });

    describe('select solr shard', () => {
      beforeEach(() => {
        userEvent.selectOptions(
          screen.getByLabelText('Solr shard'), ['UBL main']
        );
      });
      test('test required fields', async () => {
        userEvent.click(screen.getByText('Save & close'));
        expect(screen.getAllByText(/required/i)).toHaveLength(3);
        expect(screen.getAllByText('Required!', { exact: true })).toHaveLength(2);
        expect(screen.getAllByText('Integer required!')).toHaveLength(1);
        expect(onSubmit).not.toHaveBeenCalled();
      });
    });
  });

  describe('EDIT: form with initial values', () => {
    beforeEach(() => {
      renderMetadataSourceForm();
    });
    test('label should have value of fixture source', () => {
      expect(screen.getByDisplayValue('Cambridge University Press Journals')).toBeInTheDocument();
    });

    describe('change solr shard', () => {
      beforeEach(() => {
        userEvent.selectOptions(
          screen.getByLabelText('Solr shard'), ['UBL ai']
        );
      });
      test('click save should call onSubmit function', async () => {
        userEvent.click(screen.getByText('Save & close'));
        expect(onSubmit).toHaveBeenCalled();
      });
    });
  });

  describe('delete source', () => {
    beforeEach(() => {
      renderMetadataSourceForm();
    });

    test('delete modal is present', () => {
      userEvent.click(screen.getByText('Delete'));
      expect(document.getElementById('delete-source-confirmation')).toBeInTheDocument();
      expect(screen.getByText('Do you really want to delete Cambridge University Press Journals?')).toBeInTheDocument();
    });

    test('click cancel', () => {
      userEvent.click(screen.getByText('Delete'));
      const cancel = screen.getByRole('button', {
        name: 'Cancel',
        id: 'clickable-delete-source-confirmation-cancel',
      });
      userEvent.click(cancel);
      expect(onDelete).not.toHaveBeenCalled();
    });

    test('click submit', () => {
      userEvent.click(screen.getByText('Delete'));
      const submit = screen.getByRole('button', {
        name: 'Submit',
        id: 'clickable-delete-source-confirmation-confirm',
      });
      userEvent.click(submit);
      expect(onDelete).toHaveBeenCalled();
    });
  });
});
