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

class DisplayContact extends React.Component {
  static propTypes = {
    contact: PropTypes.object,
    contactId: PropTypes.string,
    contactIndex: PropTypes.number,
  };

  getContactLink(contact, contactId) {
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
  }

  getDataLable(field) {
    const fieldValue = _.get(this.props.contact, field, '');
    if (fieldValue !== '') {
      return <FormattedMessage id={`ui-finc-config.dataOption.${fieldValue}`} />;
    } else {
      return <NoValue />;
    }
  }

  render() {
    const { contact, contactIndex, contactId } = this.props;
    const contactRoleLabel = this.getDataLable('role');

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
                {this.getContactLink(contact, contactId)}
              </span>
            </KeyValue>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default DisplayContact;
