import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Card,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

class DisplayContact extends React.Component {
  static propTypes = {
    metadataSource: PropTypes.object,
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
            <Card
              cardStyle="positive"
              id={`contact #${parseInt(index + 1, 10)}`}
              headerStart={<span>{<FormattedMessage id="ui-finc-config.source.contact.title.singular" values={{ amount : index + 1 }} />}</span>}
              roundedBorder
              key={`contact #${parseInt(index + 1, 10)}`}
            >
              <Row>
                <Col xs={3}>
                  <KeyValue label={<FormattedMessage id="ui-finc-config.source.contact.type" />}>
                    <span data-test-contact-type>
                      {elem.type}
                    </span>
                  </KeyValue>
                </Col>
                <Col xs={3}>
                  <KeyValue label={<FormattedMessage id="ui-finc-config.source.contact.role" />}>
                    <span data-test-contact-role>
                      {elem.role}
                    </span>
                  </KeyValue>
                </Col>
                <Col xs={6}>
                  <KeyValue label={<FormattedMessage id="ui-finc-config.source.contact.name" />}>
                    <span data-test-contact-name>
                      {elem.name}
                    </span>
                  </KeyValue>
                </Col>
              </Row>
            </Card>
          ))}
        </Row>
      );
    }
  }
}

export default DisplayContact;
