import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import urls from '../components/DisplayUtils/urls';
import MetadataSourceView from '../components/MetadataSources/MetadataSourceView';
import { SOURCES_API } from '../util/constants';

const SourceViewRoute = ({
  history,
  location,
  match: { params: { id: sourceId } },
}) => {
  const stripes = useStripes();
  const hasPerms = stripes.hasPerm('ui-finc-config.edit');

  const useSource = () => {
    const ky = useOkapiKy();

    const { isLoading, data: source = {} } = useQuery(
      ['getSource', sourceId],
      () => ky.get(`${SOURCES_API}/${sourceId}`).json(),
      // The query will not execute until the id exists
      { enabled: Boolean(sourceId) }
    );

    return ({
      isLoading,
      source,
    });
  };

  const { source, isLoading: isSourceLoading } = useSource();

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
