import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';

import MetadataCollectionForm from '../components/MetadataCollections/MetadataCollectionForm';
import urls from '../components/DisplayUtils/urls';

const CollectionCreateRoute = ({
  history,
  location,
  mutator,
  stripes,
}) => {
  const hasPerms = stripes.hasPerm('finc-config.metadata-collections.item.post');

  const handleClose = () => {
    history.push(`${urls.collections()}${location.search}`);
  };

  const handleSubmit = (collection) => {
    mutator.collections
      .POST(collection)
      .then(({ id }) => {
        history.push(`${urls.collectionView(id)}${location.search}`);
      });
  };

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
      onSubmit={handleSubmit}
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
  mutator: PropTypes.shape({
    collections: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }).isRequired,
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
