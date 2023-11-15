import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Card,
  Col,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

import DisplayContactLinkContact from './DisplayContactLinkContact';
import DisplayContactLinkUser from './DisplayContactLinkUser';

const DisplayContact = ({
  contact,
  contactId,
  contactIndex,
}) => {
  const getContactLink = () => {
    if (contact.type === 'user') {
      return (
        <>
          <DisplayContactLinkUser
            contact={contact}
            contactId={contactId}
          />
        </>
      );
    } else if (contact.type === 'contact') {
      return (
        <>
          <DisplayContactLinkContact
            contact={contact}
            contactId={contactId}
          />
        </>
      );
    }
    return null;
  };

  const getDataLable = (field) => {
    const fieldValue = _.get(contact, field, '');
    if (fieldValue !== '') {
      return <FormattedMessage id={`ui-finc-config.dataOption.${fieldValue}`} />;
    } else {
      return <NoValue />;
    }
  };

  const contactRoleLabel = getDataLable('role');

  return (
    <Card
      cardStyle="positive"
      data-test-contact-card
      headerStart={<span><FormattedMessage id="ui-finc-config.source.contact.title.singular" values={{ amount : contactIndex + 1 }} /></span>}
      id={`contact-${parseInt(contactIndex + 1, 10)}`}
      roundedBorder
    >
      <Row>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-finc-config.source.contact.type" />}>
            <span data-test-contact-type>
              {_.upperFirst(contact.type)}
            </span>
          </KeyValue>
        </Col>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-finc-config.source.contact.role" />}>
            <span data-test-contact-role>
              {contactRoleLabel}
            </span>
          </KeyValue>
        </Col>
        <Col xs={6}>
          <KeyValue label={<FormattedMessage id="ui-finc-config.source.contact.name" />}>
            <span data-test-contact-name>
              {getContactLink()}
            </span>
          </KeyValue>
        </Col>
      </Row>
    </Card>
  );
};

DisplayContact.propTypes = {
  contact: PropTypes.object,
  contactId: PropTypes.string,
  contactIndex: PropTypes.number,
};

export default DisplayContact;
