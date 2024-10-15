import { get } from 'lodash';

import { onUpdateField } from './EditCard/editcard-util';

export const handleContactSelected = (fields, index, selectedContact) => {
  let cName = '';
  let cId = '';
  let cPlugin = '';

  if (Array.isArray(selectedContact)) {
    // receiving name from contact-plugin
    // just get the first object of returning array
    cPlugin = 'contact';
    cId = get(selectedContact[0], 'id', '');
    cName = get(selectedContact[0], 'lastName', '') + ', ' + get(selectedContact[0], 'firstName', '');
  } else if (get(selectedContact.personal, 'lastName', '') !== '') {
    // receiving name from user-plugin
    cPlugin = 'user';
    cId = get(selectedContact, 'id', '');
    cName = get(selectedContact.personal, 'lastName', '') + ', ' + get(selectedContact.personal, 'firstName', '');
  }

  onUpdateField(fields, index, {
    externalId: cId,
    name: cName,
    type: cPlugin,
  });
};
