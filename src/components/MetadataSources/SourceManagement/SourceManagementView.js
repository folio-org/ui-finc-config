import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  Button,
  Col,
  Headline,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';


import BasicCss from '../../BasicStyle.css';
import css from './SourceManagement.css';
import urls from '../../DisplayUtils/urls';
import DisplayContactsArray from './Contact/DisplayContactsArray';

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

  render() {
    const { metadataSource, id } = this.props;
    const sourceId = _.get(metadataSource, 'id', <NoValue />);
    const organization = _.get(this.props.metadataSource, 'organization', <NoValue />);

    let orgValue;
    if (this.props.resources.org && this.props.resources.org.failed) {
      if (organization.name) {
        orgValue = organization.name;
      } else {
        orgValue = <NoValue />;
      }
    } else {
      orgValue = (
        <>
          <Link to={{ pathname: `${urls.organizationView(organization.id)}` }}>
            {organization.name}
          </Link>
        </>
      );
    }

    return (
      <>
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
          <Row>
            <Headline
              className={BasicCss.styleForViewHeadline}
              size="medium"
            >
              <FormattedMessage id="ui-finc-config.source.contact.title" />
            </Headline>
          </Row>
          <Row className={css.addMarginForContacts}>
            <DisplayContactsArray
              metadataSource={metadataSource}
            />
          </Row>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-config.source.indexingLevel" />}
              value={_.get(metadataSource, 'indexingLevel', <NoValue />)}
            />
          </Row>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-config.source.generalNotes" />}
              value={_.get(metadataSource, 'generalNotes', <NoValue />)}
            />
          </Row>
        </div>
      </>
    );
  }
}

export default stripesConnect(SourceManagementView);
