import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import DisplayContact from './DisplayContact';

const DisplayContactsArray = ({ metadataSource }) => {
  const contacts = _.get(metadataSource, 'contacts', []);
  const isEmptyMessage = <FormattedMessage id="ui-finc-config.renderList.isEmpty" />;

  if (contacts.length === 0) {
    return isEmptyMessage;
  } else {
    const fields = Array.from(metadataSource.contacts);

    return (
      <>
        {fields.map((elem, index) => (
          <DisplayContact
            contact={elem}
            contactId={elem.externalId}
            contactIndex={index}
            key={index}
          />
        ))}
      </>
    );
  }
};

DisplayContactsArray.propTypes = {
  metadataSource: PropTypes.object,
};

export default DisplayContactsArray;
