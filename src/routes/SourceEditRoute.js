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
  HTTP_METHODS,
  QK_SOURCES,
} from '../util/constants';

const SourceEditRoute = ({
  history,
  location,
  match: { params: { id: sourceId } },
}) => {
  const stripes = useStripes();
  const hasPerms = stripes.hasPerm('ui-finc-config.edit');

  const { data: source = {}, isLoading: isSourceLoading } = useOkapiKyQuery(QK_SOURCES, sourceId, API_SOURCES);
  const { mutateAsync: putSource } = useOkapiKyMutation(QK_SOURCES, sourceId, API_SOURCES, HTTP_METHODS.PUT);
  const { mutateAsync: deleteSource } = useOkapiKyMutation(QK_SOURCES, sourceId, API_SOURCES, HTTP_METHODS.DELETE);

  const getInitialValues = () => {
    const initialValues = cloneDeep(source);

    return initialValues;
  };

  const handleClose = () => {
    history.push(`${urls.sourceView(sourceId)}${location.search}`);
  };

  const handleSubmit = async (values) => {
    await putSource(values);
    handleClose();
  };

  const handleDelete = async () => {
    await deleteSource();
    history.push(`${urls.sources()}${location.search}`);
  };

  if (!hasPerms) return <div><FormattedMessage id="ui-finc-config.noPermission" /></div>;

  return (
    <MetadataSourceForm
      handlers={{ onClose: handleClose }}
      initialValues={getInitialValues()}
      isLoading={isSourceLoading}
      onDelete={handleDelete}
      onSubmit={handleSubmit}
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
