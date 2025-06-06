import handleContactSelected from './contact-util';

const selectedContactViaContactsPlugin = [
  {
    id: 'user-1',
    lastName: 'Smith',
    firstName: 'Anna',
  },
];

const selectedContactViaUsersPlugin = {
  id: 'user-2',
  personal: {
    lastName: 'Smith',
    firstName: 'Anna',
  },
};

const doUpdate = jest.fn();

describe('contact-util - handleContactSelected', () => {
  const fields = {
    value: [
      { externalId: 'old-id', name: 'old-name', type: 'old-type', role: 'librarian' },
      { externalId: '', name: '', type: '' },
    ],
    update: doUpdate,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle contact data from contact-plugin correctly', () => {
    handleContactSelected(fields, 0, selectedContactViaContactsPlugin);

    expect(doUpdate).toHaveBeenCalledWith(0, {
      externalId: 'user-1',
      name: 'Smith, Anna',
      type: 'contact',
      role: 'librarian',
    });
  });

  it('should handle contact data from user-plugin correctly', () => {
    handleContactSelected(fields, 1, selectedContactViaUsersPlugin);

    expect(doUpdate).toHaveBeenCalledWith(1, {
      externalId: 'user-2',
      name: 'Smith, Anna',
      type: 'user',
    });
  });
});
