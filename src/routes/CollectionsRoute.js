import { get } from 'lodash';
import PropTypes from 'prop-types';
import {
  useEffect,
  useRef,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';
import { useQuery } from 'react-query';

import { Layout } from '@folio/stripes/components';
import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';
import { buildUrl } from '@folio/stripes/smart-components';

import urls from '../components/DisplayUtils/urls';
import filterConfig from '../components/MetadataCollections/filterConfigData';
import MetadataCollections from '../components/MetadataCollections/MetadataCollections';

// const INITIAL_RESULT_COUNT = 30;
// const RESULT_COUNT_INCREMENT = 30;
const LIMIT = 30;

const CollectionsRoute = ({
  children,
  history,
  location,
  match,
}) => {
  const ky = useOkapiKy();
  const stripes = useStripes();
  const hasPerms = stripes.hasPerm('finc-config.metadata-collections.collection.get');
  const searchField = useRef();

  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);

  const [activeFilters, setActiveFilters] = useState({});
  const [activeIndex, setActiveIndex] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  const [pendingFilters, setPendingFilters] = useState({});
  const [pendingSearch, setPendingSearch] = useState('');
  const [pendingIndex, setPendingIndex] = useState('');

  useEffect(() => {
    if (searchField.current) {
      searchField.current.focus();
    }
  }, []);

  useEffect(() => {
    setActiveFilters(pendingFilters);
    setActiveSearch(pendingSearch);
    setActiveIndex(pendingIndex);
  }, [pendingFilters, pendingSearch, pendingIndex]);

  const locationQuerySetter = ({ location, history, nsValues }) => {
    const { pathname, search } = location;
    const url = buildUrl(location, nsValues);

    // Do not push to history if the url didn't change
    if (`${pathname}${search}` !== url) {
      history.push(url);
    }
  };

  const [query, setQuery] = useState({});
  const queryGetter = () => query;

  const querySetter = ({ nsValues }) => {
    setQuery({ ...query, ...nsValues, activeIndex });
    locationQuerySetter({ location, history, nsValues });
  };

  const MDSOURCES_API = 'finc-config/tiny-metadata-sources';
  const COLLECTIONS_API = 'finc-config/metadata-collections';

  const useMdSources = () => {
    const { isLoading, data: mdSources = [], ...rest } = useQuery(
      [MDSOURCES_API],
      () => ky.get(`${MDSOURCES_API}`).json()
    );

    return ({
      isLoading,
      mdSources,
      ...rest,
    });
  };

  const updateCQLRequest = () => {
    const filterQueries = [];

    // Add search string
    if (activeSearch) {
      let searchQuery;

      if (!activeIndex) {
      // If activeIndex is empty, include all three parameters
        searchQuery = `(label=="${activeSearch}*" OR description=="${activeSearch}*" OR collectionId=="${activeSearch}*")`;
      } else {
        searchQuery = `(${activeIndex}=="${activeSearch}*")`;
      }

      filterQueries.push(searchQuery);
    }

    // Iterate over active filters
    Object.entries(activeFilters).forEach(([key, values]) => {
      if (values.length) {
        if (key === 'mdSource') {
          // Special handling for mdSource as it's a single-select
          filterQueries.push(`(${filterConfig.find(f => f.name === key).cql}=="${values[0]}")`);
        } else {
          // For multi-select filters, join the values with 'OR'
          const filterCql = values.map(value => `(${filterConfig.find(f => f.name === key).cql}=="${value}")`).join(' OR ');
          filterQueries.push(`(${filterCql})`);
        }
      }
    });

    const cqlString = filterQueries.join(' AND ');
    return encodeURIComponent(cqlString);
  };

  const handleFilterChange = (filters, searchValue) => {
    setPendingFilters(filters);
    setPendingSearch(searchValue);
  };

  // add update if search-selectbox is changing
  const onChangeIndex = (qindex) => {
    setPendingIndex(qindex);
  };

  const {
    data: { fincConfigMetadataCollections: collections = [], totalRecords: collectionsCount = 0 } = {},
    error: collectionsError,
    isLoading: areCollectionsLoading,
    isError: isCollectionsError,
    refetch,
  } = useQuery(
    ['fincConfigMetadataCollections', COLLECTIONS_API, LIMIT, offset, activeFilters, activeIndex, activeSearch],
    async () => {
      const cqlQuery = updateCQLRequest();

      if (!cqlQuery) {
        // Leere Daten zurückgeben, wenn cqlQuery leer ist
        return { fincConfigMetadataCollections: [], totalRecords: 0 };
      }

      const response = await ky.get(`${COLLECTIONS_API}?query=(${cqlQuery})&limit=${LIMIT}&offset=${offset}`).json();

      setTotal(response.totalRecords);
      return response;
    },
    {
      // Keep previous data while fetching new page
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (collectionsCount === 1) {
      history.push(`${urls.collectionView(collections[0].id)}${location.search}`);
    }
  }, [collections, collectionsCount, history, location.search]);

  const { mdSources, isLoading: isLoadingMdSources } = useMdSources();

  const handleNextPage = () => {
    if (offset + LIMIT < total) {
      setOffset((prev) => {
        const newOffset = prev + LIMIT;
        return newOffset;
      });
      refetch();
    }
  };

  const handlePrevPage = () => {
    if (offset > 0) {
      setOffset((prev) => prev - LIMIT);
      refetch();
    }
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
    <>
      <div>
        <button disabled={offset === 0} onClick={handlePrevPage}>
          Previous
        </button>
        <span>
          Page {Math.ceil(offset / LIMIT) + 1} of {Math.ceil(total / LIMIT)}
        </span>
        <button disabled={offset + LIMIT >= total} onClick={handleNextPage}>
          Next
        </button>
      </div>
      <MetadataCollections
        contentData={!areCollectionsLoading ? collections : []}
        filterData={!isLoadingMdSources ? { mdSources: get(mdSources, 'tinyMetadataSources', []) } : { mdSources: [] }}
        onChangeIndex={onChangeIndex}
        // onNeedMoreData={handleNeedMoreData}
        onFilterChange={handleFilterChange}
        queryGetter={queryGetter}
        querySetter={querySetter}
        searchField={searchField}
        searchString={location.search}
        // add values for search-selectbox
        selectedRecordId={match.params.id}
        source={{
          totalCount: () => collectionsCount,
          loaded: () => !areCollectionsLoading,
          pending: () => areCollectionsLoading,
          failure: () => isCollectionsError,
          failureMessage: () => collectionsError.message,
        }}
      >
        {children}
      </MetadataCollections>
    </>
  );
};

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
};

export default CollectionsRoute;
