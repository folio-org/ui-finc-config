import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useMutation } from 'react-query';
import { v4 as uuidv4 } from 'uuid';

import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import urls from '../components/DisplayUtils/urls';
import MetadataSourceForm from '../components/MetadataSources/MetadataSourceForm';

const SourceCreateRoute = ({
  history,
  location,
}) => {
  const ky = useOkapiKy();
  const stripes = useStripes();
  const hasPerms = stripes.hasPerm('finc-config.metadata-sources.item.post');

  const SOURCE_API = 'finc-config/metadata-sources';

  const handleClose = () => {
    history.push(`${urls.sources()}${location.search}`);
  };

  const { mutateAsync: createSource } = useMutation({
    mutationFn: (payload) => {
      const id = uuidv4();
      const newPayload = { ...payload, id };

      ky.post(SOURCE_API, { json: newPayload })
        .then(() => {
          history.push(`${urls.sourceView(id)}${location.search}`);
        });
    }
  });

  if (!hasPerms) return <div><FormattedMessage id="ui-finc-config.noPermission" /></div>;

  return (
    <MetadataSourceForm
      handlers={{ onClose: handleClose }}
      onSubmit={createSource}
    />
  );
};

SourceCreateRoute.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
};

export default SourceCreateRoute;
