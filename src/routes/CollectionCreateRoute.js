import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';

import { useStripes } from '@folio/stripes/core';

import urls from '../components/DisplayUtils/urls';
import MetadataCollectionForm from '../components/MetadataCollections/MetadataCollectionForm';
import { useOkapiKyMutation } from '../hooks';
import {
  API_COLLECTIONS,
  QK_COLLECTIONS,
} from '../util/constants';

const CollectionCreateRoute = ({
  history,
  location,
}) => {
  const stripes = useStripes();
  const hasPerms = stripes.hasPerm('ui-finc-config.create');

  const handleClose = () => {
    history.push(`${urls.collections()}${location.search}`);
  };

  const id = uuidv4();
  const { mutateAsync: createCollection } = useOkapiKyMutation(QK_COLLECTIONS, id, API_COLLECTIONS, 'POST');

  const handleSubmit = async (values) => {
    await createCollection(values);
    history.push(`${urls.collectionView(id)}${location.search}`);
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

CollectionCreateRoute.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
};

export default CollectionCreateRoute;
