import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { Row } from '@folio/stripes/components';

import DisplayContact from './DisplayContact';

class DisplayContactsArray extends React.Component {
  static propTypes = {
    metadataSource: PropTypes.object,
    stripes: PropTypes.shape({
      okapi: PropTypes.object
    }),
  };

  render() {
    const { metadataSource } = this.props;
    const contacts = _.get(metadataSource, 'contacts', []);

    if (contacts.length === 0) {
      return 'No items to show';
    } else {
      const fields = Array.from(metadataSource.contacts);

      return (
        <Row>
          {fields.map((elem, index) => (
            <DisplayContact
              contact={elem}
              contactIndex={index}
              contactId={elem.externalId}
            />
          ))}
        </Row>
      );
    }
  }
}

export default DisplayContactsArray;
