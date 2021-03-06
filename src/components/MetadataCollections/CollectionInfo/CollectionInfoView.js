import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

import urls from '../../DisplayUtils/urls';

class CollectionInfoView extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    metadataCollection: PropTypes.object,
  };

  render() {
    const { metadataCollection, id } = this.props;

    // get id and name of the source out of the fields, saved in the current collection
    const sourceId = _.get(metadataCollection, 'mdSource.id', <NoValue />);
    const sourceName = _.get(metadataCollection, 'mdSource.name', <NoValue />);
    // set the complete source link with name and status
    const sourceLink = (
      <React.Fragment>
        <Link to={{ pathname: `${urls.sourceView(sourceId)}` }}>
          {sourceName}
        </Link>
      </React.Fragment>
    );

    return (
      <React.Fragment>
        <div id={id}>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-config.collection.label" />}
              value={_.get(metadataCollection, 'label', <NoValue />)}
            />
          </Row>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-config.collection.description" />}
              value={_.get(metadataCollection, 'description', <NoValue />)}
            />
          </Row>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-config.collection.mdSource" />}
              value={sourceLink}
            />
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default CollectionInfoView;
