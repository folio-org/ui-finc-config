import { cloneDeep } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  useMutation,
  useQuery,
} from 'react-query';

import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import urls from '../components/DisplayUtils/urls';
import MetadataCollectionForm from '../components/MetadataCollections/MetadataCollectionForm';
import { COLLECTIONS_API } from '../util/constants';

const CollectionEditRoute = ({
  history,
  location,
  match: { params: { id: collectionId } },
}) => {
  const stripes = useStripes();
  const ky = useOkapiKy();

  const hasPerms = stripes.hasPerm('ui-finc-config.edit');

  const { data: collection = {}, isLoading: isCollectionLoading } = useQuery(
    ['getCollection', collectionId],
    () => ky.get(`${COLLECTIONS_API}/${collectionId}`).json()
  );

  const getInitialValues = () => {
    const initialValues = cloneDeep(collection);

    return initialValues;
  };

  const handleClose = () => {
    history.push(`${urls.collectionView(collectionId)}${location.search}`);
  };

  const { mutateAsync: putCollection } = useMutation(
    ['putCollection', collectionId],
    (payload) => ky.put(`${COLLECTIONS_API}/${collectionId}`, { json: payload })
      .then(() => {
        handleClose();
      })
  );

  const { mutateAsync: deleteCollection } = useMutation(
    ['deleteCollection', collectionId],
    () => ky.delete(`${COLLECTIONS_API}/${collectionId}`)
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
