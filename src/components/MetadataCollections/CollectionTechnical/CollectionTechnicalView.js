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

const CollectionTechnicalView = ({
  id,
  metadataCollection,
}) => {
  const renderList = (values) => {
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
  };

  const renderUrlList = (values) => {
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
  };

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
          { renderUrlList('tickets') }
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
          { renderUrlList('contentFiles') }
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
          { renderList('solrMegaCollections') }
        </Row>
      </div>
    </>
  );
};

CollectionTechnicalView.propTypes = {
  id: PropTypes.string,
  metadataCollection: PropTypes.object,
};

export default CollectionTechnicalView;
