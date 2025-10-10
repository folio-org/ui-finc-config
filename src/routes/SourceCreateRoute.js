import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';

import { useStripes } from '@folio/stripes/core';

import urls from '../components/DisplayUtils/urls';
import MetadataSourceForm from '../components/MetadataSources/MetadataSourceForm';
import { useOkapiKyMutation } from '../hooks';
import {
  API_SOURCES,
  QK_SOURCES,
} from '../util/constants';

const SourceCreateRoute = ({
  history,
  location,
}) => {
  const stripes = useStripes();
  const hasPerms = stripes.hasPerm('ui-finc-config.create');

  const handleClose = () => {
    history.push(`${urls.sources()}${location.search}`);
  };

  const id = uuidv4();
  const { mutateAsync: createSource } = useOkapiKyMutation(QK_SOURCES, id, API_SOURCES, 'POST');

  const handleSubmit = async (values) => {
    await createSource(values);
    history.push(`${urls.sourceView(id)}${location.search}`);
  };

  if (!hasPerms) return <div><FormattedMessage id="ui-finc-config.noPermission" /></div>;

  return (
    <MetadataSourceForm
      handlers={{ onClose: handleClose }}
      onSubmit={handleSubmit}
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
