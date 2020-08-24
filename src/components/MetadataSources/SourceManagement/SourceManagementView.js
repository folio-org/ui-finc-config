import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
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
import DisplayContact from './Contact/DisplayContact';

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
  };

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
          <Row>
            <Headline
              className={BasicCss.styleForViewHeadline}
              size="medium"
            >
              <FormattedMessage id="ui-finc-config.source.contact.title" />
            </Headline>
          </Row>
          <Row className={css.addMarginForContacts}>
            <DisplayContact
              metadataSource={metadataSource}
            />
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
