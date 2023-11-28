import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';

import MetadataSourceForm from '../components/MetadataSources/MetadataSourceForm';
import urls from '../components/DisplayUtils/urls';

const SourceCreateRoute = ({
  history,
  location,
  mutator,
  stripes,
}) => {
  const hasPerms = stripes.hasPerm('finc-config.metadata-sources.item.post');

  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     hasPerms: props.stripes.hasPerm('finc-config.metadata-sources.item.post'),
  //   };
  // }

  const handleClose = () => {
    history.push(`${urls.sources()}${location.search}`);
  };

  const handleSubmit = (source) => {
    mutator.sources
      .POST(source)
      .then(({ id }) => {
        history.push(`${urls.sourceView(id)}${location.search}`);
      });
  };

  if (!hasPerms) return <div><FormattedMessage id="ui-finc-config.noPermission" /></div>;

  return (
    <MetadataSourceForm
      handlers={{ onClose: handleClose }}
      onSubmit={handleSubmit}
    />
  );
};

SourceCreateRoute.manifest = Object.freeze({
  sources: {
    type: 'okapi',
    path: 'finc-config/metadata-sources',
    fetch: false,
    shouldRefresh: () => false,
  },
});

SourceCreateRoute.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  mutator: PropTypes.shape({
    sources: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
    okapi: PropTypes.object.isRequired,
  }).isRequired,
};

export default stripesConnect(SourceCreateRoute);
