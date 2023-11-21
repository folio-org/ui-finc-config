import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { StripesContext, useStripes } from '@folio/stripes/core';

import withIntlConfiguration from '../../../../test/jest/helpers/withIntlConfiguration';
import SourceManagementForm from './SourceManagementForm';

const setOrganization = jest.fn();

const organization = {};

const renderSourceManagementForm = (stripes, initialValues = { organization }) => {
  return render(withIntlConfiguration(
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
            />
          )}
        />
      </MemoryRouter>
    </StripesContext.Provider>
  ));
};

jest.unmock('react-intl');

describe('SourceManagementForm', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
    renderSourceManagementForm(stripes);
  });

  it('add contact button should be visible', () => {
    expect(document.querySelector('#add-contact-button')).toBeInTheDocument();
    expect(screen.getByText('Add contact')).toBeInTheDocument();
  });

  test('contact form with fields should be visible after click add button ', async () => {
    await userEvent.click(await screen.findByText('Add contact'));
    expect(document.querySelector('#source-form-contacts')).toBeInTheDocument();
    expect(document.querySelector('#contact-name-0')).toBeInTheDocument();
    expect(document.querySelector('#contact-role-0')).toBeInTheDocument();
  });
});
