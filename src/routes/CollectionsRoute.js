import _ from 'lodash';
import { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import { Layout } from '@folio/stripes/components';
import {
  makeQueryFunction,
  StripesConnectedSource
} from '@folio/stripes/smart-components';

import MetadataCollections from '../components/MetadataCollections/MetadataCollections';
import filterConfig from '../components/MetadataCollections/filterConfigData';
import urls from '../components/DisplayUtils/urls';
import usePrevious from '../components/hooks/usePrevious';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

const CollectionsRoute = ({
  children,
  history,
  location,
  match,
  mutator,
  resources,
  stripes,
}) => {
  const hasPerms = stripes.hasPerm('finc-config.metadata-collections.collection.get');
  const searchField = useRef();

  const [source] = useState(() => new StripesConnectedSource({ resources, mutator }, stripes.logger, 'collections'));

  const [count, setCount] = useState(source.totalCount());
  const [records, setRecords] = useState(source.records());

  const previousCount = usePrevious(count);
  const previousRecords = usePrevious(records);

  useEffect(() => {
    source.update({ resources, mutator }, 'collections');
    setCount(source.totalCount());
    setRecords(source.records());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resources, mutator]);

  useEffect(() => {
    if (count === 1) {
      if (previousCount !== 1 || (previousCount === 1 && previousRecords[0].id !== records[0].id)) {
        const record = records[0];
        history.push(`${urls.collectionView(record.id)}${location.search}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, records]);

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
    <MetadataCollections
      contentData={_.get(resources, 'collections.records', [])}
      collection={source}
      filterData={{ mdSources: _.get(resources, 'mdSources.records', []) }}
      onNeedMoreData={handleNeedMoreData}
      queryGetter={queryGetter}
      querySetter={querySetter}
      searchString={location.search}
      selectedRecordId={match.params.id}
      searchField={searchField}
      // add values for search-selectbox
      onChangeIndex={onChangeIndex}
    >
      {children}
    </MetadataCollections>
  );
};

CollectionsRoute.manifest = Object.freeze({
  collections: {
    type: 'okapi',
    records: 'fincConfigMetadataCollections',
    recordsRequired: '%{resultCount}',
    perRequest: 30,
    path: 'finc-config/metadata-collections',
    GET: {
      params: {
        query: makeQueryFunction(
          'cql.allRecords=1',
          '(label="%{query.query}*" or description="%{query.query}*" or collectionId="%{query.query}*")',
          {
            'label': 'label',
            'description': 'description',
            'collectionId': 'collectionId',
          },
          filterConfig,
          2,
        ),
      },
      staticFallback: { params: {} },
    },
  },
  mdSources: {
    type: 'okapi',
    records: 'tinyMetadataSources',
    path: 'finc-config/tiny-metadata-sources',
    resourceShouldRefresh: true
  },
  query: { initialValue: {} },
  resultCount: { initialValue: INITIAL_RESULT_COUNT },
});

CollectionsRoute.propTypes = {
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
    hasPerm: PropTypes.func,
    logger: PropTypes.object,
  }),
};

export default stripesConnect(CollectionsRoute);
