import React from 'react';
import { noop } from 'lodash';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form } from 'react-final-form';
import { StripesContext } from '@folio/stripes-core/src/StripesContext';
import { MemoryRouter } from 'react-router-dom';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import MetadataCollectionForm from './MetadataCollectionForm';
import COLLECTION from '../../../test/fixtures/metadatacollection';

const stripes = {
  clone: () => ({ ...stripes }),
  connect: Component => <Component />,
  config: {},
  hasInterface: () => true,
  hasPerm: jest.fn().mockReturnValue(true),
  logger: { log: noop },
  locale: 'en-US',
  okapi: {
    tenant: 'diku',
    url: 'https://folio-testing-okapi.dev.folio.org',
  },
  plugins: {},
  user: {
    perms: {},
    user: {
      id: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
      username: 'diku_admin',
    },
  },
  withOkapi: true,
};

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
//     renderEmptyMetadataCollectionForm();
//     expect(screen.getByText('Metadata available')).toBeVisible();
//   });

//   // TODO: move to management form:
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

