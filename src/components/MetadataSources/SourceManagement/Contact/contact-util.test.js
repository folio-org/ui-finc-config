import { handleContactSelected } from './contact-util';
import { onUpdateField } from './EditCard/editcard-util';

const selectedContactViaContactsPlugin = [{
  id: 'user-1',
  lastName: 'Smith',
  firstName: 'Anna',
}];

const selectedContactViaUsersPlugin = {
  id: 'user-2',
  personal: {
    lastName: 'Smith',
    firstName: 'Anna',
  }
};

jest.mock('./EditCard/editcard-util', () => ({
  onUpdateField: jest.fn(),
}));

describe('handleContactSelected', () => {
  let fields;

  beforeEach(() => {
    fields = {
      value: [
        { externalId: 'old-id', name: 'old-name', type: 'old-type' },
        { externalId: '', name: '', type: '' },
      ],
      update: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it('should handle contact data from contact-plugin correctly', () => {
    handleContactSelected(fields, 0, selectedContactViaContactsPlugin);

    expect(onUpdateField).toHaveBeenCalledWith(fields, 0, {
      externalId: 'user-1',
      name: 'Smith, Anna',
      type: 'contact',
    });
  });

  it('should handle contact data from user-plugin correctly', () => {
    handleContactSelected(fields, 1, selectedContactViaUsersPlugin);

    expect(onUpdateField).toHaveBeenCalledWith(fields, 1, {
      externalId: 'user-2',
      name: 'Smith, Anna',
      type: 'user',
    });
  });
});
