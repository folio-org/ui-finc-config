import { cloneDeep } from 'lodash';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useMutation, useQuery } from 'react-query';

import { useOkapiKy, useStripes } from '@folio/stripes/core';

import MetadataSourceForm from '../components/MetadataSources/MetadataSourceForm';
import urls from '../components/DisplayUtils/urls';

const SourceEditRoute = ({
  history,
  location,
  match,
}) => {
  const stripes = useStripes();
  const ky = useOkapiKy();

  const hasPerms = stripes.hasPerm('finc-config.metadata-sources.item.put');

  const SOURCE_API = `finc-config/metadata-sources/${match.params.id}`;

  const { data: source = {}, isLoading: isSourceLoading } = useContext(useQuery(
    [SOURCE_API, 'getSource'],
    () => ky.get(SOURCE_API).json()
  ));

  const getInitialValues = () => {
    const initialValues = cloneDeep(source);

    return initialValues;
  };

  const handleClose = () => {
    history.push(`${urls.sourceView(match.params.id)}${location.search}`);
  };

  const { mutateAsync: putSource } = useMutation(
    [SOURCE_API, 'putSource'],
    (payload) => ky.put(SOURCE_API, { json: payload })
      .then(() => {
        handleClose();
      })
  );

  const { mutateAsync: deleteSource } = useMutation(
    [SOURCE_API, 'deleteSource'],
    () => ky.delete(SOURCE_API)
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
