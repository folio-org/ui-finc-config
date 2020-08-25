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
import { stripesConnect } from '@folio/stripes/core';


import BasicCss from '../../BasicStyle.css';
import css from './SourceManagement.css';
import urls from '../../DisplayUtils/urls';
import DisplayContactsArray from './Contact/DisplayContactsArray';

class SourceManagementView extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    metadataSource: PropTypes.object,
    stripes: PropTypes.object,
  };

  render() {
    const { metadataSource, id } = this.props;
    const sourceId = _.get(metadataSource, 'id', '-');

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
              stripes={this.props.stripes}
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
