import { MemoryRouter } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';
import {
  StripesContext,
  useStripes,
} from '@folio/stripes/core';

import renderWithIntlConfiguration from '../../../../../test/jest/helpers/renderWithIntlConfiguration';
import DisplayContact from './DisplayContact';

jest.mock('./DisplayContactLinkUser', () => () => <div>Mocked User Link</div>);
jest.mock('./DisplayContactLinkContact', () => () => <div>Mocked Contact Link</div>);

const renderDisplayContact = (stripes, contactMock) => {
  return renderWithIntlConfiguration(
    <StripesContext.Provider value={stripes}>
      <MemoryRouter>
        <DisplayContact
          contact={contactMock}
          contactId="contact-id-1"
          contactIndex={0}
        />
      </MemoryRouter>
    </StripesContext.Provider>
  );
};

const contactUserMock = {
  name: 'Parker, Alex',
  type: 'user',
  role: 'technical',
};

const contactContactMock = {
  name: 'Parker, Alex',
  type: 'contact',
  role: 'technical',
};

jest.unmock('react-intl');

describe('DisplayContact', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
  });

  it('should render contact card with title, type, role and name', () => {
    renderDisplayContact(stripes, contactUserMock);

    expect(screen.getByText('Contact #1')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Technical')).toBeInTheDocument();
  });

  it('should render DisplayContactLinkUser if type is "user"', () => {
    renderDisplayContact(stripes, contactUserMock);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.queryByText('Contact')).not.toBeInTheDocument();
  });

  it('should render DisplayContactLinkContact if type is "contact"', () => {
    renderDisplayContact(stripes, contactContactMock);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.queryByText('User')).not.toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });
});
