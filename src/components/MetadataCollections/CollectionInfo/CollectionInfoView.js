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

const CollectionInfoView = ({
  id,
  metadataCollection,
}) => {
  // get id and name of the source out of the fields, saved in the current collection
  const sourceId = _.get(metadataCollection, 'mdSource.id', <NoValue />);
  const sourceName = _.get(metadataCollection, 'mdSource.name', <NoValue />);
  // set the complete source link with name and status
  const sourceLink = (
    <>
      <Link to={{ pathname: `${urls.sourceView(sourceId)}` }}>
        {sourceName}
      </Link>
    </>
  );

  return (
    <>
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
    </>
  );
};

CollectionInfoView.propTypes = {
  id: PropTypes.string,
  metadataCollection: PropTypes.object,
};

export default CollectionInfoView;
