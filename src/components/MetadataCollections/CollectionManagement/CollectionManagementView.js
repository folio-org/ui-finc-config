import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Headline,
  KeyValue,
  List,
  NoValue,
  Row
} from '@folio/stripes/components';

import BasicCss from '../../BasicStyle.css';

class CollectionManagementView extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    metadataCollection: PropTypes.object,
  };

  renderList = (values) => {
    const { metadataCollection } = this.props;

    if (!metadataCollection) {
      return 'no values';
    } else {
      const valueItems = metadataCollection[values];
      const valueFormatter = (valueItem) => (<li key={valueItem}>{valueItem}</li>);
      const isEmptyMessage = 'No items to show';

      return (
        <List
          items={valueItems}
          itemFormatter={valueFormatter}
          isEmptyMessage={isEmptyMessage}
        />
      );
    }
  }

  render() {
    const { metadataCollection, id } = this.props;

    return (
      <React.Fragment>
        <div id={id}>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-config.collection.metadataAvailable" />}
              value={_.get(metadataCollection, 'metadataAvailable', <NoValue />)}
            />
          </Row>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-config.collection.usageRestricted" />}
              value={_.get(metadataCollection, 'usageRestricted', <NoValue />)}
            />
          </Row>
          <Row>
            <Headline
              className={BasicCss.styleForViewHeadline}
              size="medium"
            >
              <FormattedMessage id="ui-finc-config.collection.permittedFor" />
            </Headline>
          </Row>
          <Row>
            { this.renderList('permittedFor') }
          </Row>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-config.collection.freeContent" />}
              value={_.get(metadataCollection, 'freeContent', <NoValue />)}
            />
          </Row>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-config.collection.lod.publication" />}
              value={_.get(metadataCollection, 'lod.publication', <NoValue />)}
            />
          </Row>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-config.collection.lod.note" />}
              value={_.get(metadataCollection, 'lod.note', <NoValue />)}
            />
          </Row>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-config.collection.generalNotes" />}
              value={_.get(metadataCollection, 'generalNotes', <NoValue />)}
            />
          </Row>
          <Row>
            <Headline
              className={BasicCss.styleForViewHeadline}
              size="medium"
            >
              <FormattedMessage id="ui-finc-config.collection.selectedBy" />
            </Headline>
          </Row>
          <Row>
            { this.renderList('selectedBy') }
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default CollectionManagementView;
