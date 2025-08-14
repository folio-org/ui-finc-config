import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useMutation } from 'react-query';
import { v4 as uuidv4 } from 'uuid';

import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import urls from '../components/DisplayUtils/urls';
import MetadataCollectionForm from '../components/MetadataCollections/MetadataCollectionForm';

const CollectionCreateRoute = ({
  history,
  location,
}) => {
  const ky = useOkapiKy();
  const stripes = useStripes();
  const hasPerms = stripes.hasPerm('ui-finc-config.create');

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
    },
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

CollectionCreateRoute.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
};

export default CollectionCreateRoute;
