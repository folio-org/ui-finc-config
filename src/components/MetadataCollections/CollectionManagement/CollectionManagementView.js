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

class CollectionManagementView extends React.Component {
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

  getDataLable(field) {
    const fieldValue = _.get(this.props.metadataCollection, field, '');
    if (fieldValue !== '') {
      return <FormattedMessage id={`ui-finc-config.dataOption.${fieldValue}`} />;
    } else {
      return <NoValue />;
    }
  }

  render() {
    const { metadataCollection, id } = this.props;
    const metadataAvailableLabel = this.getDataLable('metadataAvailable');
    const usageRestrictedLabel = this.getDataLable('usageRestricted');
    const freeContentLabel = this.getDataLable('freeContent');
    const lodPublicationLabel = this.getDataLable('lod.publication');

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
            { this.renderList('permittedFor') }
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
            { this.renderList('selectedBy') }
          </Row>
        </div>
      </>
    );
  }
}

export default CollectionManagementView;
