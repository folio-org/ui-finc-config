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

class SourceTechnicalView extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    metadataSource: PropTypes.object,
  };

  renderList = (values) => {
    const { metadataSource } = this.props;
    const isEmptyMessage = <FormattedMessage id="ui-finc-config.renderList.isEmpty" />;

    if (!metadataSource) {
      return isEmptyMessage;
    } else {
      const valueItems = metadataSource[values];
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
    const { metadataSource } = this.props;
    const isEmptyMessage = <FormattedMessage id="ui-finc-config.renderList.isEmpty" />;

    if (!metadataSource) {
      return isEmptyMessage;
    } else {
      const valueItems = metadataSource[values];
      const valueFormatter = (valueItem) => (<li key={valueItem}><a href={valueItem} target="_blank" rel="noopener noreferrer">{valueItem}</a></li>);

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
    const { metadataSource, id } = this.props;
    const accessUrlValue = _.get(metadataSource, 'accessUrl', <NoValue />);
    const accessUrlValueFormatter = <a href={accessUrlValue} target="_blank" rel="noopener noreferrer">{accessUrlValue}</a>;

    return (
      <>
        <div id={id}>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-config.source.lastProcessed" />}
              value={_.get(metadataSource, 'lastProcessed', <NoValue />)}
            />
          </Row>
          {/* TICKET is repeatable */}
          <Row>
            <Headline
              className={BasicCss.styleForViewHeadline}
              size="medium"
            >
              <FormattedMessage id="ui-finc-config.source.tickets" />
            </Headline>
          </Row>
          <Row>
            { this.renderUrlList('tickets') }
          </Row>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-config.source.accessUrl" />}
              value={accessUrlValueFormatter}
            />
          </Row>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-config.source.id" />}
              value={_.get(metadataSource, 'sourceId', <NoValue />)}
            />
          </Row>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-config.source.solrShard" />}
              value={_.get(metadataSource, 'solrShard', <NoValue />)}
            />
          </Row>
          {/* DELIVERYMETHODS is repeatable */}
          <Row>
            <Headline
              className={BasicCss.styleForViewHeadline}
              size="medium"
            >
              <FormattedMessage id="ui-finc-config.source.deliveryMethods" />
            </Headline>
          </Row>
          <Row>
            { this.renderList('deliveryMethods') }
          </Row>
          {/* FORMATS is repeatable */}
          <Row>
            <Headline
              className={BasicCss.styleForViewHeadline}
              size="medium"
            >
              <FormattedMessage id="ui-finc-config.source.formats" />
            </Headline>
          </Row>
          <Row>
            { this.renderList('formats') }
          </Row>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-config.source.updateRhythm" />}
              value={_.get(metadataSource, 'updateRhythm', <NoValue />)}
            />
          </Row>
          {/* INFERIORTO is repeatable */}
          <Row>
            <Headline
              className={BasicCss.styleForViewHeadline}
              size="medium"
            >
              <FormattedMessage id="ui-finc-config.source.inferiorTo" />
            </Headline>
          </Row>
          <Row>
            { this.renderList('inferiorTo') }
          </Row>
        </div>
      </>
    );
  }
}

export default SourceTechnicalView;
