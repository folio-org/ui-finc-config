import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { useOkapiKyQuery } from '@folio/stripes-leipzig-components';
import { useStripes } from '@folio/stripes/core';

import urls from '../components/DisplayUtils/urls';
import MetadataSourceView from '../components/MetadataSources/MetadataSourceView';
import {
  API_SOURCES,
  QK_SOURCES,
} from '../util/constants';

const SourceViewRoute = ({
  history,
  location,
  match: { params: { id: sourceId } },
}) => {
  const stripes = useStripes();
  const hasPerms = stripes.hasPerm('ui-finc-config.edit');

  const { data: source = {}, isLoading: isSourceLoading } = useOkapiKyQuery({
    queryKey: [QK_SOURCES, sourceId],
    id: sourceId,
    api: API_SOURCES,
  });

  const handleClose = () => {
    history.push(`${urls.sources()}${location.search}`);
  };

  const handleEdit = () => {
    history.push(`${urls.sourceEdit(sourceId)}${location.search}`);
  };

  return (
    <MetadataSourceView
      canEdit={hasPerms}
      handlers={{
        onClose: handleClose,
        onEdit: handleEdit,
      }}
      isLoading={isSourceLoading}
      record={source}
      stripes={stripes}
    />
  );
};

SourceViewRoute.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default SourceViewRoute;
