import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { stripesConnect } from '@folio/stripes/core';

import urls from '../components/DisplayUtils/urls';
import MetadataCollectionView from '../components/MetadataCollections/MetadataCollectionView';

const CollectionViewRoute = ({
  history,
  location,
  match,
  resources,
  stripes,
}) => {
  const handleClose = () => {
    history.push(`${urls.collections()}${location.search}`);
  };

  const handleEdit = () => {
    history.push(`${urls.collectionEdit(match.params.id)}${location.search}`);
  };

  return (
    <MetadataCollectionView
      canEdit={stripes.hasPerm('finc-config.metadata-collections.item.put')}
      handlers={{
        onClose: handleClose,
        onEdit: handleEdit,
      }}
      isLoading={_.get(resources, 'collection.isPending', true)}
      record={_.get(resources, 'collection.records', []).find(i => i.id === match.params.id)}
      stripes={stripes}
    />
  );
};

CollectionViewRoute.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    collection: PropTypes.object,
  }).isRequired,
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
    okapi: PropTypes.object.isRequired,
  }).isRequired,
};

CollectionViewRoute.manifest = Object.freeze({
  collection: {
    type: 'okapi',
    path: 'finc-config/metadata-collections/:{id}',
  },
  query: {},
});

export default stripesConnect(CollectionViewRoute);
