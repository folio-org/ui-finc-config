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

const CollectionManagementView = ({
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

  const getDataLable = (field) => {
    const fieldValue = _.get(metadataCollection, field, '');
    if (fieldValue !== '') {
      return <FormattedMessage id={`ui-finc-config.dataOption.${fieldValue}`} />;
    } else {
      return <NoValue />;
    }
  };

  const metadataAvailableLabel = getDataLable('metadataAvailable');
  const usageRestrictedLabel = getDataLable('usageRestricted');
  const freeContentLabel = getDataLable('freeContent');
  const lodPublicationLabel = getDataLable('lod.publication');

  return (
    <>
      <div id={id}>
        <Row>
          <KeyValue
            label={<FormattedMessage id="ui-finc-config.collection.metadataAvailable" />}
            value={metadataAvailableLabel}
          />
        </Row>
        <Row>
          <KeyValue
            label={<FormattedMessage id="ui-finc-config.collection.usageRestricted" />}
            value={usageRestrictedLabel}
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
          { renderList('permittedFor') }
        </Row>
        <Row>
          <KeyValue
            label={<FormattedMessage id="ui-finc-config.collection.freeContent" />}
            value={freeContentLabel}
          />
        </Row>
        <Row>
          <KeyValue
            label={<FormattedMessage id="ui-finc-config.collection.lod.publication" />}
            value={lodPublicationLabel}
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
          { renderList('selectedBy') }
        </Row>
      </div>
    </>
  );
};

CollectionManagementView.propTypes = {
  id: PropTypes.string,
  metadataCollection: PropTypes.object,
};

export default CollectionManagementView;
