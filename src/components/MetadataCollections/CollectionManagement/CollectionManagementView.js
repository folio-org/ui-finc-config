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

import metadataAvailableOptions from '../../DataOptions/metadataAvailable';
import usageRestrictedOptions from '../../DataOptions/usageRestricted';
import freeContentOptions from '../../DataOptions/freeContent';
import lodPublicationOptions from '../../DataOptions/lodPublication';
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

    const metadataAvailableValue = _.get(metadataCollection, 'metadataAvailable', '');
    const dataWithMetadataAvailableValue = metadataAvailableOptions.find(
      (e) => e.value === metadataAvailableValue
    );
    const metadataAvailableLabel = _.get(dataWithMetadataAvailableValue, 'label', <NoValue />);

    const usageRestrictedValue = _.get(metadataCollection, 'usageRestricted', '');
    const dataWithUsageRestrictedValue = usageRestrictedOptions.find(
      (e) => e.value === usageRestrictedValue
    );
    const usageRestrictedLabel = _.get(dataWithUsageRestrictedValue, 'label', <NoValue />);

    const freeContentValue = _.get(metadataCollection, 'freeContent', '');
    const dataWithFreeContentValue = freeContentOptions.find(
      (e) => e.value === freeContentValue
    );
    const freeContentLabel = _.get(dataWithFreeContentValue, 'label', <NoValue />);

    const lodPublicationValue = _.get(metadataCollection, 'lod.publication', '');
    const dataWithLodPublicationValue = lodPublicationOptions.find(
      (e) => e.value === lodPublicationValue
    );
    const lodPublicationLabel = _.get(dataWithLodPublicationValue, 'label', <NoValue />);

    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  }
}

export default CollectionManagementView;
