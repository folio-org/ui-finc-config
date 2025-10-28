import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { NoValue } from '@folio/stripes/components';

import { useOkapiKyQuery } from '../../../../hooks';
import {
  API_ORG_CONTACTS,
  QK_ORG_CONTACTS,
} from '../../../../util/constants';
import urls from '../../../DisplayUtils/urls';

const DisplayContactLinkContact = ({
  contact,
  contactId,
}) => {
  let contactNameWithLink = <NoValue />;
  const { data: organizationsContact, isLoading: isLoadingContact, isError } = useOkapiKyQuery({
    queryKey: [QK_ORG_CONTACTS, contactId],
    id: contactId,
    api: API_ORG_CONTACTS,
  });

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
