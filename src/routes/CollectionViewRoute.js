import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { useStripes } from '@folio/stripes/core';

import urls from '../components/DisplayUtils/urls';
import MetadataCollectionView from '../components/MetadataCollections/MetadataCollectionView';
import { useOkapiKyQuery } from '../hooks';
import {
  API_COLLECTIONS,
  QK_COLLECTIONS,
} from '../util/constants';

const CollectionViewRoute = ({
  history,
  location,
  match: { params: { id: collectionId } },
}) => {
  const stripes = useStripes();
  const hasPerms = stripes.hasPerm('ui-finc-config.edit');

  const { data: collection, isLoading: isCollectionLoading } = useOkapiKyQuery({
    queryKey: [QK_COLLECTIONS],
    id: collectionId,
    api: API_COLLECTIONS,
  });

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
};

export default CollectionViewRoute;
