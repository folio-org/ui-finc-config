import { cloneDeep } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useStripes } from '@folio/stripes/core';

import urls from '../components/DisplayUtils/urls';
import MetadataSourceForm from '../components/MetadataSources/MetadataSourceForm';
import {
  useOkapiKyMutation,
  useOkapiKyQuery,
} from '../hooks';
import {
  API_SOURCES,
  QK_SOURCES,
} from '../util/constants';

const SourceEditRoute = ({
  history,
  location,
  match: { params: { id: sourceId } },
}) => {
  const stripes = useStripes();
  const hasPerms = stripes.hasPerm('ui-finc-config.edit');

  const { data: source = {}, isLoading: isSourceLoading } = useOkapiKyQuery({
    queryKey: [QK_SOURCES],
    id: sourceId,
    api: API_SOURCES,
  });

  const { useUpdate, useDelete } = useOkapiKyMutation({
    queryKey: [QK_SOURCES, sourceId],
    id: sourceId,
    api: API_SOURCES,
  });

  const getInitialValues = () => {
    const initialValues = cloneDeep(source);

    return initialValues;
  };

  const handleClose = () => {
    history.push(`${urls.sourceView(sourceId)}${location.search}`);
  };

  const { mutateAsync: putSource } = useUpdate({
    onSuccess: () => {
      handleClose();
    },
  });

  const { mutateAsync: deleteSource } = useDelete({
    onSuccess: () => {
      history.push(`${urls.sources()}${location.search}`);
    },
  });

  if (!hasPerms) return <div><FormattedMessage id="ui-finc-config.noPermission" /></div>;

  return (
    <MetadataSourceForm
      handlers={{ onClose: handleClose }}
      initialValues={getInitialValues()}
      isLoading={isSourceLoading}
      onDelete={deleteSource}
      onSubmit={putSource}
    />
  );
};

SourceEditRoute.propTypes = {
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

export default SourceEditRoute;
