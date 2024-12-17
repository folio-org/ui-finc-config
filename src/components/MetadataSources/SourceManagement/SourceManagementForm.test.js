import arrayMutators from 'final-form-arrays';
import { Form } from 'react-final-form';
import { MemoryRouter } from 'react-router-dom';

import {
  screen,
  within,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import {
  StripesContext,
  useStripes,
} from '@folio/stripes/core';

import renderWithIntlConfiguration from '../../../../test/jest/helpers/renderWithIntlConfiguration';
import SourceManagementForm from './SourceManagementForm';

const onToggle = jest.fn();
const setOrganization = jest.fn();

const renderSourceManagementForm = (stripes, initialValues = {}) => {
  return renderWithIntlConfiguration(
    <StripesContext.Provider value={stripes}>
      <MemoryRouter>
        <Form
          mutators={{
            setOrganization,
            ...arrayMutators,
          }}
          onSubmit={jest.fn}
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

jest.unmock('react-intl');

describe('SourceManagementForm', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
    renderSourceManagementForm(stripes);
  });

  it('should be visible the add contact button', () => {
    expect(screen.getByRole('button', { name: 'Add contact' })).toBeInTheDocument();
  });

  test('clicking add contact button and remove contact button', async () => {
    const managementAccordion = screen.getByRole('region', { name: 'Icon Management' });
    expect(managementAccordion).toBeInTheDocument();
    expect(within(managementAccordion).queryByRole('textbox', { name: 'Name Icon' })).not.toBeInTheDocument();
    expect(within(managementAccordion).queryByRole('combobox', { name: 'Role' })).not.toBeInTheDocument();

    const addContactButton = screen.getByRole('button', { name: 'Add contact' });
    expect(addContactButton).toBeInTheDocument();
    await userEvent.click(addContactButton);
    expect(document.querySelector('#source-form-contacts')).toBeInTheDocument();
    expect(within(managementAccordion).getByRole('textbox', { name: 'Name Icon' })).toBeInTheDocument();
    expect(within(managementAccordion).getByRole('combobox', { name: 'Role' })).toBeInTheDocument();

    const removeContactButton = screen.getByRole('button', { name: 'Remove contact' });
    expect(removeContactButton).toBeInTheDocument();
    await userEvent.click(removeContactButton);
    expect(within(managementAccordion).queryByRole('textbox', { name: 'Name Icon' })).not.toBeInTheDocument();
    expect(within(managementAccordion).queryByRole('combobox', { name: 'Role' })).not.toBeInTheDocument();
  });
});
