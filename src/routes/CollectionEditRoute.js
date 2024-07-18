import { cloneDeep } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useMutation, useQuery } from 'react-query';

import { useOkapiKy, useStripes } from '@folio/stripes/core';

import MetadataCollectionForm from '../components/MetadataCollections/MetadataCollectionForm';
import urls from '../components/DisplayUtils/urls';

const CollectionEditRoute = ({
  history,
  location,
  match,
}) => {
  const stripes = useStripes();
  const ky = useOkapiKy();

  const hasPerms = stripes.hasPerm('finc-config.metadata-collections.item.put');

  const COLLECTION_API = `finc-config/metadata-collections/${match.params.id}`;

  const { data: collection = {}, isLoading: isCollectionLoading } = useQuery(
    [COLLECTION_API, 'getCollection'],
    () => ky.get(COLLECTION_API).json()
  );

  const getInitialValues = () => {
    const initialValues = cloneDeep(collection);

    return initialValues;
  };

  const handleClose = () => {
    history.push(`${urls.collectionView(match.params.id)}${location.search}`);
  };

  const { mutateAsync: putCollection } = useMutation(
    [COLLECTION_API, 'putCollection'],
    (payload) => ky.put(COLLECTION_API, { json: payload })
      .then(() => {
        handleClose();
      })
  );

  const { mutateAsync: deleteCollection } = useMutation(
    [COLLECTION_API, 'deleteCollection'],
    () => ky.delete(COLLECTION_API)
      .then(() => {
        history.push(`${urls.collections()}${location.search}`);
      })
  );

  const handleSubmit = (values) => {
    return putCollection(values);
  };

  if (!hasPerms) return <div><FormattedMessage id="ui-finc-config.noPermission" /></div>;

  return (
    <MetadataCollectionForm
      handlers={{ onClose: handleClose }}
      initialValues={getInitialValues()}
      isLoading={isCollectionLoading}
      onDelete={deleteCollection}
      onSubmit={handleSubmit}
    />
  );
};

CollectionEditRoute.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default CollectionEditRoute;
