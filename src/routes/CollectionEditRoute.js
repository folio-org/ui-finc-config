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
  QK_COLLECTIONS,
} from '../util/constants';

const CollectionEditRoute = ({
  history,
  location,
  match: { params: { id: collectionId } },
}) => {
  const stripes = useStripes();

  const hasPerms = stripes.hasPerm('ui-finc-config.edit');

  const { data: collection = {}, isLoading: isCollectionLoading } = useOkapiKyQuery({
    queryKey: [QK_COLLECTIONS],
    id: collectionId,
    api: API_COLLECTIONS,
  });

  const { useUpdate, useDelete } = useOkapiKyMutation({
    queryKey: [QK_COLLECTIONS, collectionId],
    id: collectionId,
    api: API_COLLECTIONS,
  });

  const getInitialValues = () => {
    const initialValues = cloneDeep(collection);

    return initialValues;
  };

  const handleClose = () => {
    history.push(`${urls.collectionView(collectionId)}${location.search}`);
  };

  const { mutateAsync: deleteCollection } = useDelete({
    onSuccess: () => {
      history.push(`${urls.collections()}${location.search}`);
    },
  });

  const { mutateAsync: putCollection } = useUpdate({
    onSuccess: () => {
      handleClose();
    },
  });

  if (!hasPerms) return <div><FormattedMessage id="ui-finc-config.noPermission" /></div>;

  return (
    <MetadataCollectionForm
      handlers={{ onClose: handleClose }}
      initialValues={getInitialValues()}
      isLoading={isCollectionLoading}
      onDelete={deleteCollection}
      onSubmit={putCollection}
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
