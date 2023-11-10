import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { useQuery } from 'react-query';

import { useOkapiKy, useStripes } from '@folio/stripes/core';

import urls from '../components/DisplayUtils/urls';
import MetadataCollectionView from '../components/MetadataCollections/MetadataCollectionView';

const CollectionViewRoute = ({
  history,
  location,
  match: { params: { id: collectionId } },
}) => {
  const stripes = useStripes();
  const hasPerms = stripes.hasPerm('finc-config.metadata-collections.item.put');

  const COLLECTION_API = 'finc-config/metadata-collections';

  const useCollection = () => {
    const ky = useOkapiKy();

    const { isLoading, data: collection = {} } = useQuery(
      [COLLECTION_API, collectionId],
      () => ky.get(`${COLLECTION_API}/${collectionId}`).json(),
      // The query will not execute until the id exists
      { enabled: Boolean(collectionId) },
    );

    return ({
      isLoading,
      collection,
    });
  };

  const { collection, isLoading: isCollectionLoading } = useCollection();

  const handleClose = () => {
    history.push(`${urls.collections()}${location.search}`);
  };

  const handleEdit = () => {
    history.push(`${urls.collectionEdit(collectionId)}${location.search}`);
  };

  return (
    <MetadataCollectionView
      canEdit={hasPerms}
      handlers={{
        onClose: handleClose,
        onEdit: handleEdit,
      }}
      isLoading={isCollectionLoading}
      record={collection}
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
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
    okapi: PropTypes.object.isRequired,
  }),
};

export default CollectionViewRoute;
