import { cloneDeep } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useStripes } from '@folio/stripes/core';

import urls from '../components/DisplayUtils/urls';
import MetadataCollectionForm from '../components/MetadataCollections/MetadataCollectionForm';
import {
  useOkapiKyMutation,
  useOkapiKyQuery,
} from '../hooks';
import {
  API_COLLECTIONS,
  HTTP_METHODS,
  QK_COLLECTIONS,
} from '../util/constants';

const CollectionEditRoute = ({
  history,
  location,
  match: { params: { id: collectionId } },
}) => {
  const stripes = useStripes();

  const hasPerms = stripes.hasPerm('ui-finc-config.edit');

  const {
    data: collection = {},
    isLoading: isCollectionLoading,
  } = useOkapiKyQuery(QK_COLLECTIONS, collectionId, API_COLLECTIONS);
  const { mutateAsync: putCollection } = useOkapiKyMutation({
    queryKey: QK_COLLECTIONS,
    id: collectionId,
    api: API_COLLECTIONS,
    method: HTTP_METHODS.PUT,
  });
  const { mutateAsync: deleteCollection } = useOkapiKyMutation({
    queryKey: QK_COLLECTIONS,
    id: collectionId,
    api: API_COLLECTIONS,
    method: HTTP_METHODS.DELETE,
  });

  const getInitialValues = () => {
    const initialValues = cloneDeep(collection);

    return initialValues;
  };

  const handleClose = () => {
    history.push(`${urls.collectionView(collectionId)}${location.search}`);
  };

  const handleDelete = async () => {
    await deleteCollection();
    history.push(`${urls.collections()}${location.search}`);
  };

  const handleSubmit = async (values) => {
    await putCollection(values);
    handleClose();
  };

  if (!hasPerms) return <div><FormattedMessage id="ui-finc-config.noPermission" /></div>;

  return (
    <MetadataCollectionForm
      handlers={{ onClose: handleClose }}
      initialValues={getInitialValues()}
      isLoading={isCollectionLoading}
      onDelete={handleDelete}
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
