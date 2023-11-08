import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { stripesConnect } from '@folio/stripes/core';

import urls from '../components/DisplayUtils/urls';
import MetadataSourceView from '../components/MetadataSources/MetadataSourceView';

const SourceViewRoute = ({
  history,
  location,
  match,
  resources,
  stripes,
}) => {
  const handleClose = () => {
    history.push(`${urls.sources()}${location.search}`);
  };

  const handleEdit = () => {
    history.push(`${urls.sourceEdit(match.params.id)}${location.search}`);
  };

  return (
    <MetadataSourceView
      canEdit={stripes.hasPerm('finc-config.metadata-sources.item.put')}
      handlers={{
        onClose: handleClose,
        onEdit: handleEdit,
      }}
      isLoading={_.get(resources, 'source.isPending', true)}
      record={_.get(resources, 'source.records', []).find(i => i.id === match.params.id)}
      stripes={stripes}
    />
  );
};

SourceViewRoute.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    source: PropTypes.object,
  }).isRequired,
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
    okapi: PropTypes.object.isRequired,
  }).isRequired,
};

SourceViewRoute.manifest = Object.freeze({
  source: {
    type: 'okapi',
    path: 'finc-config/metadata-sources/:{id}',
  },
  query: {},
});

export default stripesConnect(SourceViewRoute);
