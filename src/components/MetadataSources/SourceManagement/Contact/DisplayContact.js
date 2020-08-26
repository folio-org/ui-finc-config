import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Card,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import DisplayContactLinkContact from './DisplayContactLinkContact';
import DisplayContactLinkUser from './DisplayContactLinkUser';

class DisplayContact extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      okapi: PropTypes.object
    }),
    contact: PropTypes.object,
    contactIndex: PropTypes.number,
    contactId: PropTypes.string,
  };

  getContactLink(contact, contactId) {
    if (contact.type === 'user') {
      return (
        <React.Fragment>
          <DisplayContactLinkUser
            contact={contact}
            contactId={contactId}
          />
        </React.Fragment>
      );
    } else if (contact.type === 'contact') {
      return (
        <React.Fragment>
          <DisplayContactLinkContact
            contact={contact}
            contactId={contactId}
          />
        </React.Fragment>
      );
    }
    return null;
  }

  render() {
    const { contact, contactIndex, contactId } = this.props;

    return (
      <Card
        cardStyle="positive"
        id={`contact #${parseInt(contactIndex + 1, 10)}`}
        headerStart={<span>{<FormattedMessage id="ui-finc-config.source.contact.title.singular" values={{ amount : contactIndex + 1 }} />}</span>}
        roundedBorder
        key={`contact #${parseInt(contactIndex + 1, 10)}`}
      >
        <Row>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-finc-config.source.contact.type" />}>
              <span data-test-contact-type>
                {contact.type}
              </span>
            </KeyValue>
          </Col>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-finc-config.source.contact.role" />}>
              <span data-test-contact-role>
                {contact.role}
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
