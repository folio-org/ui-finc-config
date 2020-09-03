import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  NoValue,
  Row
} from '@folio/stripes/components';

import implementationStatusOptions from '../../DataOptions/implementationStatus';

class SourceInfoView extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    metadataSource: PropTypes.object,
  };

  render() {
    const { metadataSource, id } = this.props;
    const iStatus = _.get(metadataSource, 'status', '');
    const implementationStatus = implementationStatusOptions.find(
      (e) => e.value === iStatus
    );
    const implementationStatusLabel = _.get(implementationStatus, 'label', <NoValue />);

    return (
      <React.Fragment>
        <div id={id}>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-config.source.label" />}
              value={_.get(metadataSource, 'label', <NoValue />)}
            />
          </Row>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-config.source.description" />}
              value={_.get(metadataSource, 'description', <NoValue />)}
            />
          </Row>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-config.source.status" />}
              value={implementationStatusLabel}
            />
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default SourceInfoView;
