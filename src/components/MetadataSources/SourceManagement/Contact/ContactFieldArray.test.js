import { MemoryRouter } from 'react-router-dom';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { StripesContext, useStripes } from '@folio/stripes/core';

import ContactFieldArray from './ContactFieldArray';
import withIntlConfiguration from '../../../../../test/jest/helpers/withIntlConfiguration';

const renderContactFieldArray = (stripes) => {
  return render(withIntlConfiguration(
    <StripesContext.Provider value={stripes}>
      <MemoryRouter>
        <Form
          onSubmit={jest.fn()}
          mutators={{
            ...arrayMutators,
          }}
          render={() => (
            <ContactFieldArray fields={{ name: 'contacts' }} />
          )}
        />
      </MemoryRouter>
    </StripesContext.Provider>
  ));
};

jest.unmock('react-intl');

describe('ContactFieldArray', () => {
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
