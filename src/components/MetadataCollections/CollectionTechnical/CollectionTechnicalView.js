import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Headline,
  KeyValue,
  List,
  NoValue,
  Row,
} from '@folio/stripes/components';

import BasicCss from '../../BasicStyle.css';

class CollectionTechnicalView extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    metadataCollection: PropTypes.object,
  };

  renderList = (values) => {
    const { metadataCollection } = this.props;
    const isEmptyMessage = <FormattedMessage id="ui-finc-config.renderList.isEmpty" />;

    if (!metadataCollection) {
      return isEmptyMessage;
    } else {
      const valueItems = metadataCollection[values];
      const valueFormatter = (valueItem) => (<li key={valueItem}>{valueItem}</li>);

      return (
        <List
          isEmptyMessage={isEmptyMessage}
          items={valueItems}
          itemFormatter={valueFormatter}
        />
      );
    }
  }

  renderUrlList = (values) => {
    const { metadataCollection } = this.props;
    const isEmptyMessage = <FormattedMessage id="ui-finc-config.renderList.isEmpty" />;

    if (!metadataCollection) {
      return isEmptyMessage;
    } else {
      const valueItems = metadataCollection[values];
      const valueFormatter = (valueItem) => (<li key={valueItem}><a href={valueItem} target="_blank" rel="noopener noreferrer">{valueItem}</a></li>);

      return (
        <List
          isEmptyMessage={isEmptyMessage}
          items={valueItems}
          itemFormatter={valueFormatter}
        />
      );
    }
  }

  render() {
    const { metadataCollection, id } = this.props;

    return (
      <>
        <div id={id}>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-config.collection.id" />}
              value={_.get(metadataCollection, 'collectionId', <NoValue />)}
            />
          </Row>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-config.collection.productIsil" />}
              value={_.get(metadataCollection, 'productIsil', <NoValue />)}
            />
          </Row>
          <Row>
            <Headline
              className={BasicCss.styleForViewHeadline}
              size="medium"
            >
              <FormattedMessage id="ui-finc-config.collection.tickets" />
            </Headline>
          </Row>
          <Row>
            { this.renderUrlList('tickets') }
          </Row>
          <Row>
            <Headline
              className={BasicCss.styleForViewHeadline}
              size="medium"
            >
              <FormattedMessage id="ui-finc-config.collection.contentFiles" />
            </Headline>
          </Row>
          <Row>
            { this.renderUrlList('contentFiles') }
          </Row>
          <Row>
            <Headline
              className={BasicCss.styleForViewHeadline}
              size="medium"
            >
              <FormattedMessage id="ui-finc-config.collection.solrMegaCollections" />
            </Headline>
          </Row>
          <Row>
            { this.renderList('solrMegaCollections') }
          </Row>
        </div>
      </>
    );
  }
}

export default CollectionTechnicalView;
