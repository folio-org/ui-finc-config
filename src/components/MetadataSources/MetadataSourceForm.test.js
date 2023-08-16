import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Form } from 'react-final-form';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
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
      beforeEach(async () => {
        await userEvent.selectOptions(
          screen.getByLabelText('Solr shard'), ['UBL main']
        );
      });

      test('test required fields', async () => {
        await userEvent.click(screen.getByText('Save & close'));
        expect(screen.getAllByText(/required/i)).toHaveLength(3);
        expect(screen.getAllByText('Required!', { exact: true })).toHaveLength(2);
        expect(screen.getByText('Integer required!')).toBeInTheDocument();
        expect(onSubmit).not.toHaveBeenCalled();
      });
    });
  });

  describe('EDIT: form with initial values', () => {
    beforeEach(() => {
      renderMetadataSourceForm(stripes);
    });

    test('label should have value of fixture source', () => {
      expect(screen.getByDisplayValue('Cambridge University Press Journals')).toBeInTheDocument();
    });

    describe('change solr shard', () => {
      beforeEach(async () => {
        await userEvent.selectOptions(
          screen.getByLabelText('Solr shard'), ['UBL ai']
        );
      });

      test('click save should call onSubmit function', async () => {
        await userEvent.click(screen.getByText('Save & close'));
        expect(onSubmit).toHaveBeenCalled();
      });
    });
  });

  describe('delete source', () => {
    beforeEach(() => {
      renderMetadataSourceForm(stripes);
    });

    test('delete modal is present', async () => {
      await userEvent.click(screen.getByText('Delete'));
      expect(document.getElementById('delete-source-confirmation')).toBeInTheDocument();
      expect(screen.getByText('Do you really want to delete Cambridge University Press Journals?')).toBeInTheDocument();
    });

    test('click cancel', async () => {
      await userEvent.click(screen.getByText('Delete'));
      const cancel = screen.getByRole('button', {
        name: 'Cancel',
        id: 'clickable-delete-source-confirmation-cancel',
      });
      await userEvent.click(cancel);
      expect(onDelete).not.toHaveBeenCalled();
    });

    test('click submit', async () => {
      await userEvent.click(screen.getByText('Delete'));
      const submit = screen.getByRole('button', {
        name: 'Submit',
        id: 'clickable-delete-source-confirmation-confirm',
      });
      await userEvent.click(submit);
      expect(onDelete).toHaveBeenCalled();
    });
  });
});
