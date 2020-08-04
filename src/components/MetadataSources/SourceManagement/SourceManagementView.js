import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Col,
  Headline,
  KeyValue,
  MultiColumnList,
  Row,
} from '@folio/stripes/components';
import { Link } from 'react-router-dom';
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
    resources: PropTypes.shape({
      org: PropTypes.object,
      failed: PropTypes.object,
    }).isRequired,
  };

  renderContacts = (type) => {
    const { metadataSource } = this.props;

    if (!metadataSource) {
      return 'no values';
    } else {
      return (
        <MultiColumnList
          columnWidths={{
            name: '46%',
            role: '46%'
          }}
          columnMapping={{
            name: <FormattedMessage id="ui-finc-config.source.contact.name" />,
            role: <FormattedMessage id="ui-finc-config.source.contact.role" />
          }}
          contentData={_.get(metadataSource.contacts, type, [])}
          interactive={false}
          isEmptyMessage={`no ${type} contact`}
          visibleColumns={['name', 'role']}
        />
      );
    }
  }

  render() {
    const { metadataSource, id } = this.props;
    const sourceId = _.get(metadataSource, 'id', '-');
    const organization = _.get(this.props.metadataSource, 'organization', '-');

    let orgValue;
    if (this.props.resources.org && this.props.resources.org.failed) {
      if (organization.name) {
        orgValue = organization.name;
      } else {
        orgValue = '-';
      }
    } else {
      orgValue = (
        <React.Fragment>
          <Link to={{
            pathname: `${urls.organizationView(organization.id)}`,
          }}
          >
            {organization.name}
          </Link>
        </React.Fragment>
      );
    }

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
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-config.source.organization" />}
              value={orgValue}
            />
          </Row>
          <Row className={css.addMarginForContacts}>
            <Col xs={6}>
              <Headline
                className={BasicCss.styleForViewHeadline}
                size="medium"
              >
                <FormattedMessage id="ui-finc-config.source.contacts.internal" />
              </Headline>
              { this.renderContacts('internal') }
            </Col>
            <Col xs={6}>
              <Headline
                className={BasicCss.styleForViewHeadline}
                size="medium"
              >
                <FormattedMessage id="ui-finc-config.source.contacts.external" />
              </Headline>
              { this.renderContacts('external') }
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
