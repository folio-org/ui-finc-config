import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  Card,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';

import urls from '../../../DisplayUtils/urls';

class DisplayContact extends React.Component {
  static manifest = Object.freeze({
    org: {
      type: 'okapi',
      path: 'organizations-storage/organizations/!{contactId}',
      throwErrors: false
    },
    query: {},
  });

  static propTypes = {
    resources: PropTypes.shape({
      org: PropTypes.object,
      failed: PropTypes.object,
    }).isRequired,
    stripes: PropTypes.shape({
      okapi: PropTypes.object
    }),
    contact: PropTypes.object,
    contactIndex: PropTypes.number,
    contactId: PropTypes.string,
  };

  render() {
    const { contact, contactIndex, contactId } = this.props;

    let orgValue;
    if (contact.type === 'contact') {
      if (this.props.resources.org && this.props.resources.org.failed) {
        if (contact.name) {
          orgValue = contact.name;
        } else {
          orgValue = '-';
        }
      } else {
        orgValue = (
          <React.Fragment>
            <Link to={{
              pathname: `${urls.organizationView(contactId)}`,
            }}
            >
              {contact.name}
            </Link>
          </React.Fragment>
        );
      }
    } else if (contact.type === 'user') {
      if (contact.name) {
        orgValue = contact.name;
      } else {
        orgValue = '-';
      }
    }

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
                {orgValue}
              </span>
            </KeyValue>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default stripesConnect(DisplayContact);
