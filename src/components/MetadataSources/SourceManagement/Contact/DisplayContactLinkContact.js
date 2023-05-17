import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { stripesConnect } from '@folio/stripes/core';

import urls from '../../../DisplayUtils/urls';

class DisplayContactLinkContact extends React.Component {
  static manifest = Object.freeze({
    org: {
      type: 'okapi',
      path: 'organizations-storage/contacts/!{contactId}',
      throwErrors: false
    },
    query: {},
  });

  static propTypes = {
    contact: PropTypes.object,
    contactId: PropTypes.string,
    resources: PropTypes.shape({
      org: PropTypes.object,
      failed: PropTypes.object,
    }).isRequired,
  };

  getContactForContact = (contact, contactId) => {
    if (contact.type === 'contact' && this.props.resources.org && this.props.resources.org.failed && contact.name) {
      return contact.name;
    } else {
      return (
        <>
          <Link to={{ pathname: `${urls.contactView(contactId)}` }}>
            {contact.name}
          </Link>
        </>
      );
    }
  }

  render() {
    const { contact, contactId } = this.props;
    const contactNameWithLink = this.getContactForContact(contact, contactId);

    return (
      <>
        {contactNameWithLink}
      </>
    );
  }
}

export default stripesConnect(DisplayContactLinkContact);
