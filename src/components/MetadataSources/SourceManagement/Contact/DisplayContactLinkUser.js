import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { stripesConnect } from '@folio/stripes/core';

import urls from '../../../DisplayUtils/urls';

class DisplayContactLinkUser extends React.Component {
  static manifest = Object.freeze({
    user: {
      type: 'okapi',
      path: 'users/!{contactId}',
      throwErrors: false
    },
    query: {},
  });

  static propTypes = {
    contact: PropTypes.object,
    contactId: PropTypes.string,
    resources: PropTypes.shape({
      user: PropTypes.object,
      failed: PropTypes.object,
    }).isRequired,
  };

  getContactForUser = (contact, contactId) => {
    if (contact.type === 'user' && this.props.resources.user && this.props.resources.user.failed && contact.name) {
      return contact.name;
    } else {
      return (
        <>
          <Link to={{ pathname: `${urls.userView(contactId)}` }}>
            {contact.name}
          </Link>
        </>
      );
    }
  }

  render() {
    const { contact, contactId } = this.props;
    const contactNameWithLink = this.getContactForUser(contact, contactId);

    return (
      <>
        {contactNameWithLink}
      </>
    );
  }
}

export default stripesConnect(DisplayContactLinkUser);
