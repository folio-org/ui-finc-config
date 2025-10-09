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
import MetadataSourceForm from '../components/MetadataSources/MetadataSourceForm';
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
  const ky = useOkapiKy();

  const hasPerms = stripes.hasPerm('ui-finc-config.edit');

  const { data: source = {}, isLoading: isSourceLoading } = useQuery(
    [QK_SOURCES, sourceId],
    () => ky.get(`${API_SOURCES}/${sourceId}`).json()
  );

  const getInitialValues = () => {
    const initialValues = cloneDeep(source);

    return initialValues;
  };

  const handleClose = () => {
    history.push(`${urls.sourceView(sourceId)}${location.search}`);
  };

  const { mutateAsync: putSource } = useMutation(
    [QK_SOURCES, sourceId],
    (payload) => ky.put(`${API_SOURCES}/${sourceId}`, { json: payload })
      .then(() => {
        handleClose();
      })
  );

  const { mutateAsync: deleteSource } = useMutation(
    [QK_SOURCES, sourceId],
    () => ky.delete(`${API_SOURCES}/${sourceId}`)
      .then(() => {
        history.push(`${urls.sources()}${location.search}`);
      })
  );

  const handleSubmit = (values) => {
    return putSource(values);
  };

  if (!hasPerms) return <div><FormattedMessage id="ui-finc-config.noPermission" /></div>;

  return (
    <MetadataSourceForm
      handlers={{ onClose: handleClose }}
      initialValues={getInitialValues()}
      isLoading={isSourceLoading}
      onDelete={deleteSource}
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
