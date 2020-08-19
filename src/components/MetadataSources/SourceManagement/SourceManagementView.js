import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Card,
  Col,
  Headline,
  KeyValue,
  Row,
} from '@folio/stripes/components';
// import { Link } from 'react-router-dom';
import { stripesConnect } from '@folio/stripes/core';


import BasicCss from '../../BasicStyle.css';
import css from './SourceManagement.css';
import urls from '../../DisplayUtils/urls';

class SourceManagementView extends React.Component {
  static manifest = Object.freeze({
    org: {
      type: 'okapi',
      path: 'organizations-storage/organizations/!{organizationId}',
      throwErrors: false
    },
    query: {},
  });

  static propTypes = {
    id: PropTypes.string,
    metadataSource: PropTypes.object,
    // resources: PropTypes.shape({
    //   org: PropTypes.object,
    //   failed: PropTypes.object,
    // }).isRequired,
  };

  renderContacts = () => {
  // renderContacts() {
    const { metadataSource } = this.props;

    if (!metadataSource) {
      return 'no values';
    } else {
      const fields = metadataSource.contacts;

      return (
        <Row>
          {fields.map((elem, index) => (
            <Card
              cardStyle="positive"
              id={`contact #${parseInt(index + 1, 10)}`}
              headerStart={<span>{`Contact #${parseInt(index + 1, 10)}`}</span>}
              roundedBorder
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

  render() {
    const { metadataSource, id } = this.props;
    const sourceId = _.get(metadataSource, 'id', '-');
    // const organization = _.get(this.props.metadataSource, 'organization', '-');

    // let orgValue;
    // if (this.props.resources.org && this.props.resources.org.failed) {
    //   if (organization.name) {
    //     orgValue = organization.name;
    //   } else {
    //     orgValue = '-';
    //   }
    // } else {
    //   orgValue = (
    //     <React.Fragment>
    //       <Link to={{
    //         pathname: `${urls.organizationView(organization.id)}`,
    //       }}
    //       >
    //         {organization.name}
    //       </Link>
    //     </React.Fragment>
    //   );
    // }

    return (
      <React.Fragment>
        <div id={id}>
          <Row>
            <Col xs={6}>
              <Button
                buttonStyle="primary"
                id="showAllCollections"
                to={urls.showAllCollections(sourceId)}
              >
                <FormattedMessage id="ui-finc-config.source.button.showAllCollections" />
              </Button>
            </Col>
          </Row>
          {/* <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-config.source.organization" />}
              value={orgValue}
            />
          </Row> */}
          <Row className={css.addMarginForContacts}>
            <Col xs={6}>
              <Headline
                className={BasicCss.styleForViewHeadline}
                size="medium"
              >
                <FormattedMessage id="ui-finc-config.source.contact.title" />
              </Headline>
              { this.renderContacts() }
            </Col>
          </Row>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-config.source.indexingLevel" />}
              value={_.get(metadataSource, 'indexingLevel', '-')}
            />
          </Row>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-config.source.generalNotes" />}
              value={_.get(metadataSource, 'generalNotes', '-')}
            />
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default stripesConnect(SourceManagementView);
