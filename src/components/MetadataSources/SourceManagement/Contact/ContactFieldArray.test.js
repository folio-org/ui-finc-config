import { MemoryRouter } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { StripesContext, useStripes } from '@folio/stripes/core';

import ContactFieldArray from './ContactFieldArray';
import FindContact from '../FindContact/FindContact';
import FindUser from '../FindUser/FindUser';
import withIntlConfiguration from '../../../../../test/jest/helpers/withIntlConfiguration';

const selectedContact = jest.fn();

const renderContactFieldArray = (stripes) => {
  return render(withIntlConfiguration(
    <StripesContext.Provider value={stripes}>
      <MemoryRouter>
        <Form
          onSubmit={jest.fn}
          mutators={{
            selectedContact,
            ...arrayMutators,
          }}
          render={() => withIntlConfiguration(
            <ContactFieldArray fields={{ name: 'contacts' }}>
              <FindContact index={1} selectContact />
              <Field component={FindUser} index={1} selectContact name="contacts" />
            </ContactFieldArray>
          )}
        />
      </MemoryRouter>
    </StripesContext.Provider>
  ));
};

jest.unmock('react-intl');

describe('ContactFieldArray - handleContactSelected', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
    renderContactFieldArray(stripes);
  });

  test('adding EditCards for contacts', async () => {
    const addContactButton = screen.getByRole('button', { name: 'Add contact' });
    expect(addContactButton).toBeInTheDocument();
    expect(screen.queryByText('Contact #1')).not.toBeInTheDocument();

    await userEvent.click(addContactButton);
    expect(screen.getByText('Contact #1')).toBeInTheDocument();

    const deleteButton = screen.getByLabelText('delete-contact');
    expect(deleteButton).toBeInTheDocument();
    await userEvent.click(deleteButton);
    expect(screen.queryByText('Contact #1')).not.toBeInTheDocument();

    await userEvent.click(addContactButton);
    await userEvent.click(addContactButton);
    expect(screen.getByText('Contact #1')).toBeInTheDocument();
    expect(screen.getByText('Contact #2')).toBeInTheDocument();
  });
});
