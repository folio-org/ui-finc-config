import arrayMutators from 'final-form-arrays';
import { Form } from 'react-final-form';
import { MemoryRouter } from 'react-router-dom';

import {
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import {
  StripesContext,
  useStripes,
} from '@folio/stripes/core';

import renderWithIntlConfiguration from '../../../../../test/jest/helpers/renderWithIntlConfiguration';
import ContactFieldArray from './ContactFieldArray';

const renderContactFieldArray = (stripes, contactsMock = {}) => {
  return renderWithIntlConfiguration(
    <StripesContext.Provider value={stripes}>
      <MemoryRouter>
        <Form
          initialValues={contactsMock}
          mutators={{
            ...arrayMutators,
          }}
          onSubmit={jest.fn()}
          render={() => (
            <ContactFieldArray name="contacts" />
          )}
        />
      </MemoryRouter>
    </StripesContext.Provider>
  );
};

jest.unmock('react-intl');

describe('ContactFieldArray', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
  });

  test('adding EditCards for contacts', async () => {
    renderContactFieldArray(stripes);

    const addContactButton = screen.getByRole('button', { name: 'Add contact' });

    expect(addContactButton).toBeInTheDocument();
    expect(screen.queryByText('Contact #1')).not.toBeInTheDocument();

    await userEvent.click(addContactButton);
    await waitFor(() => {
      expect(screen.getByText('Contact #1')).toBeInTheDocument();
    });

    const deleteButton = screen.getByLabelText('Delete contact #1');
    expect(deleteButton).toBeInTheDocument();
    await userEvent.click(deleteButton);
    await waitFor(() => {
      expect(screen.queryByText('Contact #1')).not.toBeInTheDocument();
    });

    await userEvent.click(addContactButton);
    await userEvent.click(addContactButton);

    expect(screen.getByText('Contact #1')).toBeInTheDocument();
    expect(screen.getByText('Contact #2')).toBeInTheDocument();
  });

  test('shows connected contact name', async () => {
    const contactMock = {
      contacts: [
        {
          externalId: '1234',
          name: 'Parker, Alex',
          type: 'user',
          role: 'technical',
        },
      ],
    };

    renderContactFieldArray(stripes, contactMock);

    expect(screen.getByDisplayValue('Parker, Alex')).toBeInTheDocument();
  });

  test('show correct contact labels after delete EditCard', async () => {
    const contactsMock = {
      contacts: [
        {
          externalId: '1111',
          name: 'Neumann, Chris',
          type: 'user',
          role: 'specialist',
        },
        {
          externalId: '2222',
          name: 'Keller, Robin',
          type: 'contact',
          role: 'technical',
        },
        {
          externalId: '3333',
          name: 'Brooks, Riley',
          type: 'user',
          role: 'librarian',
        },
      ],
    };

    renderContactFieldArray(stripes, contactsMock);

    expect(screen.getByDisplayValue('Neumann, Chris')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Keller, Robin')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Brooks, Riley')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /delete contact #2/i }));
    await waitFor(() => {
      expect(screen.queryByDisplayValue('Keller, Robin')).not.toBeInTheDocument();
    });

    expect(screen.getByDisplayValue('Neumann, Chris')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Brooks, Riley')).toBeInTheDocument();
  });
});
