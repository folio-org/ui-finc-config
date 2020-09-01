import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  NoValue,
  Row
} from '@folio/stripes/components';

class SourceInfoView extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    metadataSource: PropTypes.object,
  };

  render() {
    const { metadataSource, id } = this.props;

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
              value={_.get(metadataSource, 'status', <NoValue />)}
            />
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default SourceInfoView;
