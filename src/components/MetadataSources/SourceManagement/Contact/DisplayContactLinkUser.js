import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { NoValue } from '@folio/stripes/components';

import { useOkapiKyQuery } from '../../../../hooks';
import {
  API_USERS,
  QK_USERS,
} from '../../../../util/constants';
import urls from '../../../DisplayUtils/urls';

const DisplayContactLinkUser = ({
  contact,
  contactId,
}) => {
  let contactNameWithLink = <NoValue />;
  const { data: user, isLoading: isLoadingUser, isError } = useOkapiKyQuery({
    queryKey: [QK_USERS, contactId],
    id: contactId,
    api: API_USERS,
  });

  if (!isEmpty(contactId) && !isLoadingUser) {
    if (contact.type === 'user' && user && isError && contact.name) {
      contactNameWithLink = contact.name;
    } else {
      contactNameWithLink = (
        <Link to={{ pathname: `${urls.userView(contactId)}` }}>
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

DisplayContactLinkUser.propTypes = {
  contact: PropTypes.object,
  contactId: PropTypes.string,
};

export default DisplayContactLinkUser;
