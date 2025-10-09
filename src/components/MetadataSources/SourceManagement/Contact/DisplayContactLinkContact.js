import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import { NoValue } from '@folio/stripes/components';
import { useOkapiKy } from '@folio/stripes/core';

import {
  API_ORG_CONTACTS,
  QK_ORG_CONTACTS,
} from '../../../../util/constants';
import urls from '../../../DisplayUtils/urls';

const DisplayContactLinkContact = ({
  contact,
  contactId,
}) => {
  const useContact = () => {
    const ky = useOkapiKy();

    const { isLoading, data: organizationsContact = {}, ...rest } = useQuery(
      [QK_ORG_CONTACTS, contactId],
      () => ky.get(`${API_ORG_CONTACTS}/${contactId}`).json(),
      // The query will not execute until the id exists
      { enabled: Boolean(contactId) }
    );

    return ({
      isLoading,
      organizationsContact,
      ...rest,
    });
  };

  let contactNameWithLink = <NoValue />;
  const { organizationsContact, isLoading: isLoadingContact, isError } = useContact();

  if (!isEmpty(contactId) && !isLoadingContact) {
    if (contact.type === 'contact' && organizationsContact && isError && contact.name) {
      contactNameWithLink = contact.name;
    } else {
      contactNameWithLink = (
        <Link to={{ pathname: `${urls.contactView(contactId)}` }}>
          {contact.name}
        </Link>
      );
    }
  }

  return (
    <>
      {contactNameWithLink}
    </>
  );
};

DisplayContactLinkContact.propTypes = {
  contact: PropTypes.object,
  contactId: PropTypes.string,
};

export default DisplayContactLinkContact;
