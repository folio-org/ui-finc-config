import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useMutation } from 'react-query';
import { v4 as uuidv4 } from 'uuid';

import { stripesConnect, useOkapiKy } from '@folio/stripes/core';

import MetadataCollectionForm from '../components/MetadataCollections/MetadataCollectionForm';
import urls from '../components/DisplayUtils/urls';

const CollectionCreateRoute = ({
  history,
  location,
  stripes,
}) => {
  const ky = useOkapiKy();
  const hasPerms = stripes.hasPerm('finc-config.metadata-collections.item.post');

  const COLLECTION_API = 'finc-config/metadata-collections';

  const handleClose = () => {
    history.push(`${urls.collections()}${location.search}`);
  };

  const { mutateAsync: createCollection } = useMutation({
    mutationFn: (payload) => {
      const id = uuidv4();
      const newPayload = { ...payload, id };

      ky.post(COLLECTION_API, { json: newPayload })
        .then(() => {
          history.push(`${urls.collectionView(id)}${location.search}`);
        });
    }
  });

  const getInitialSolrMegaCollection = () => {
    // add first field for required repeatable field
    const solrMegaCollections = [''];

    return { solrMegaCollections };
  };

  if (!hasPerms) return <div><FormattedMessage id="ui-finc-config.noPermission" /></div>;

  return (
    <MetadataCollectionForm
      handlers={{ onClose: handleClose }}
      initialValues={getInitialSolrMegaCollection()}
      onSubmit={createCollection}
    />
  );
};

CollectionCreateRoute.manifest = Object.freeze({
  collections: {
    type: 'okapi',
    path: 'finc-config/metadata-collections',
    fetch: false,
    shouldRefresh: () => false,
  },
});

CollectionCreateRoute.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    collections: PropTypes.object,
  }).isRequired,
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
    okapi: PropTypes.object.isRequired,
  }).isRequired,
};

export default stripesConnect(CollectionCreateRoute);
