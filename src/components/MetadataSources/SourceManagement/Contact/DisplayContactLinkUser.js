import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { NoValue } from '@folio/stripes/components';

import urls from '../../../DisplayUtils/urls';

const DisplayContactLinkUser = ({
  contact,
  contactId,
}) => {
  const USERS_API = 'users';

  const useUser = () => {
    const ky = useOkapiKy();

    const { isLoading, data: user = {}, ...rest } = useQuery(
      [USERS_API, contactId],
      () => ky.get(`${USERS_API}/${contactId}`).json(),
      // The query will not execute until the id exists
      { enabled: Boolean(contactId) },
    );

    return ({
      isLoading,
      user,
      ...rest
    });
  };

  let contactNameWithLink = <NoValue />;
  const { user, isLoading: isLoadingUser, isError } = useUser();

  if (!isEmpty(contactId) && !isLoadingUser) {
    if (contact.type === 'user' && user && isError && contact.name) {
      contactNameWithLink = contact.name;
    } else {
      contactNameWithLink = (
        <>
          <Link to={{ pathname: `${urls.userView(contactId)}` }}>
            {contact.name}
          </Link>
        </>
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
