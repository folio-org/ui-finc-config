import _ from 'lodash';
import { useRef, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import { Layout } from '@folio/stripes/components';
import {
  makeQueryFunction,
  StripesConnectedSource
} from '@folio/stripes/smart-components';

import MetadataSources from '../components/MetadataSources/MetadataSources';
import filterConfig from '../components/MetadataSources/filterConfigData';
import urls from '../components/DisplayUtils/urls';
import usePrevious from '../components/hooks/usePrevious';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

const SourcesRoute = ({
  children,
  history,
  location,
  match,
  mutator,
  resources,
  stripes,
}) => {
  const hasPerms = stripes.hasPerm('finc-config.metadata-sources.collection.get');
  const searchField = useRef();

  const source = useMemo(
    () => new StripesConnectedSource({ resources, mutator }, stripes.logger, 'sources'),
    [mutator, resources, stripes.logger]
  );

  const [count, setCount] = useState(source.totalCount());
  const [records, setRecords] = useState(source.records());

  const previousCount = usePrevious(count);
  const previousRecords = usePrevious(records);

  useEffect(() => {
    source.update({ resources, mutator }, 'sources');
    setCount(source.totalCount());
    setRecords(source.records());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resources, mutator]);

  if (count === 1) {
    if (previousCount !== 1 || (previousCount === 1 && previousRecords[0].id !== records[0].id)) {
      const record = records[0];
      history.push(`${urls.sourceView(record.id)}${location.search}`);
    }
  }

  useEffect(() => {
    if (searchField.current) {
      searchField.current.focus();
    }
  }, []);

  const querySetter = ({ nsValues }) => {
    mutator.query.update(nsValues);
  };

  const queryGetter = () => {
    return _.get(resources, 'query', {});
  };

  const handleNeedMoreData = () => {
    if (source) {
      source.fetchMore(RESULT_COUNT_INCREMENT);
    }
  };

  // add update if search-selectbox is changing
  const onChangeIndex = (qindex) => {
    mutator.query.update({ qindex });
  };

  if (!hasPerms) {
    return (
      <Layout className="textCentered">
        <h2><FormattedMessage id="stripes-smart-components.permissionError" /></h2>
        <p><FormattedMessage id="stripes-smart-components.permissionsDoNotAllowAccess" /></p>
      </Layout>
    );
  }

  return (
    <MetadataSources
      contentData={_.get(resources, 'sources.records', [])}
      filterData={{ contacts: _.get(resources, 'contacts.records', []) }}
      onNeedMoreData={handleNeedMoreData}
      queryGetter={queryGetter}
      querySetter={querySetter}
      searchString={location.search}
      selectedRecordId={match.params.id}
      searchField={searchField}
      source={source}
      // add values for search-selectbox
      onChangeIndex={onChangeIndex}
    >
      {children}
    </MetadataSources>
  );
};

SourcesRoute.manifest = Object.freeze({
  sources: {
    type: 'okapi',
    records: 'fincConfigMetadataSources',
    recordsRequired: '%{resultCount}',
    perRequest: 30,
    path: 'finc-config/metadata-sources',
    GET: {
      params: {
        query: makeQueryFunction(
          'cql.allRecords=1',
          '(label="%{query.query}*" or description="%{query.query}*" or sourceId="%{query.query}*")',
          {
            'label': 'label',
            'description': 'description',
            'sourceId': 'sourceId/number',
          },
          filterConfig,
          2,
        ),
      },
      staticFallback: { params: {} },
    },
  },
  contacts: {
    type: 'okapi',
    records: 'contacts',
    path: 'finc-config/contacts',
    resourceShouldRefresh: true
  },
  query: {
    initialValue: {
      query: '',
      filters: 'status.active,status.implementation',
      sort: 'label'
    }
  },
  resultCount: { initialValue: INITIAL_RESULT_COUNT },
});

SourcesRoute.propTypes = {
  children: PropTypes.node,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
  mutator: PropTypes.object,
  resources: PropTypes.object,
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
    logger: PropTypes.object,
  }),
};

export default stripesConnect(SourcesRoute);
