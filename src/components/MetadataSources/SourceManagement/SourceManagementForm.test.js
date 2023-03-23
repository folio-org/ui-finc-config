import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StripesContext } from '@folio/stripes/core';

import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';
import SourceManagementForm from './SourceManagementForm';
import stripes from '../../../../test/jest/__mock__/stripesCore.mock';

const onToggle = jest.fn();
const setOrganization = jest.fn();

const organization = {};

const renderSourceManagementForm = (initialValues = { organization }) => {
  return renderWithIntl(
    <StripesContext.Provider value={stripes}>
      <MemoryRouter>
        <Form
          onSubmit={jest.fn}
          mutators={{
            setOrganization,
            ...arrayMutators,
          }}
          render={() => (
            <SourceManagementForm
              accordionId="editSourceManagement"
              expanded
              initialValues={initialValues}
              onToggle={onToggle}
            />
          )}
        />
      </MemoryRouter>
    </StripesContext.Provider>
  );
};

describe('SourceManagementForm', () => {
  beforeEach(() => {
    renderSourceManagementForm();
  });
  it('add contact button should be visible', () => {
    expect(document.querySelector('#add-contact-button')).toBeInTheDocument();
    expect(screen.getByText('Add contact')).toBeInTheDocument();
  });

  test('contact form with fields should be visible after click add button ', async () => {
    userEvent.click(await screen.findByText('Add contact'));
    expect(document.querySelector('#source-form-contacts')).toBeInTheDocument();
    expect(document.querySelector('#contact-name-0')).toBeInTheDocument();
    expect(document.querySelector('#contact-role-0')).toBeInTheDocument();
  });
});
