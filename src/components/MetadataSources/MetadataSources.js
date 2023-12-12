import _ from 'lodash';
import React, { useState } from 'react';
import {
  withRouter,
  Link,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  injectIntl,
  FormattedMessage
} from 'react-intl';

import {
  CollapseFilterPaneButton,
  ExpandFilterPaneButton,
  SearchAndSortQuery,
  SearchAndSortNoResultsMessage as NoResultsMessage,
} from '@folio/stripes/smart-components';
import {
  Button,
  Icon,
  MultiColumnList,
  NoValue,
  Pane,
  PaneHeader,
  PaneMenu,
  Paneset,
  SearchField,
} from '@folio/stripes/components';
import {
  AppIcon,
  IfPermission,
} from '@folio/stripes/core';

import urls from '../DisplayUtils/urls';
import SourceFilters from './SourceFilters';
import FincNavigation from '../Navigation/FincNavigation';

const rawSearchableIndexes = [
  { label: 'all', value: '', makeQuery: term => `(label="${term}*" or description="${term}*" or sourceId="${term}*")` },
  { label: 'label', value: 'label', makeQuery: term => `(label="${term}*")` },
  { label: 'description', value: 'description', makeQuery: term => `(description="${term}*")` },
  { label: 'sourceId', value: 'sourceId', makeQuery: term => `(sourceId="${term}*")` },
];
let searchableIndexes;

const defaultFilter = { state: { status: ['active', 'implementation'] }, string: 'status.active,status.implementation' };
const defaultSearchString = { query: '' };
const defaultSearchIndex = '';

const MetadataSources = ({
  children,
  contentData,
  disableRecordCreation,
  filterData,
  history,
  intl,
  onNeedMoreData,
  onSelectRow,
  queryGetter,
  querySetter,
  searchString,
  selectedRecordId,
  searchField,
  source,
  // add values for search-selectbox
  onChangeIndex,
}) => {
  const [filterPaneIsVisible, setFilterPaneIsVisible] = useState(true);

  const [storedFilter, setStoredFilter] = useState(
    localStorage.getItem('fincConfigSourceFilters') ? JSON.parse(localStorage.getItem('fincConfigSourceFilters')) : defaultFilter
  );
  const [storedSearchString, setStoredSearchString] = useState(
    localStorage.getItem('fincConfigSourceSearchString') ? JSON.parse(localStorage.getItem('fincConfigSourceSearchString')) : defaultSearchString
  );
  const [storedSearchIndex, setStoredSearchIndex] = useState(
    localStorage.getItem('fincConfigSourceSearchIndex') ? JSON.parse(localStorage.getItem('fincConfigSourceSearchIndex')) : defaultSearchIndex
  );

  const getDataLable = (fieldValue) => {
    if (fieldValue !== '') {
      return <FormattedMessage id={`ui-finc-config.dataOption.${fieldValue}`} />;
    } else {
      return <NoValue />;
    }
  };

  const resultsFormatter = {
    label: result => result.label,
    sourceId: result => result.sourceId,
    status: result => getDataLable(_.get(result, 'status', '')),
    solrShard: result => result.solrShard,
    lastProcessed: result => result.lastProcessed,
  };

  // generate url for record-details
  const rowURL = (id) => {
    return `${urls.sourceView(id)}${searchString}`;
    // NEED FILTER: "status.active,status.technical implementation,status.request,status.negotiation"
  };

  const rowFormatter = (row) => {
    const { rowClass, rowData, rowIndex, rowProps = {}, cells } = row;
    let RowComponent;

    if (onSelectRow) {
      RowComponent = 'div';
    } else {
      RowComponent = Link;
      rowProps.to = rowURL(rowData.id);
    }

    return (
      <RowComponent
        aria-rowindex={rowIndex + 2}
        className={rowClass}
        data-label={[
          rowData.name,
        ]}
        key={`row-${rowIndex}`}
        role="row"
        {...rowProps}
      >
        {cells}
      </RowComponent>
    );
  };

  // fade in/out of filter-pane
  const toggleFilterPane = () => {
    setFilterPaneIsVisible(!filterPaneIsVisible);
  };

  // fade in / out the filter menu
  const renderResultsFirstMenu = (filters) => {
    const filterCount = filters.string !== '' ? filters.string.split(',').length : 0;
    if (filterPaneIsVisible) {
      return null;
    }

    return (
      <PaneMenu>
        <ExpandFilterPaneButton
          filterCount={filterCount}
          onClick={toggleFilterPane}
        />
      </PaneMenu>
    );
  };

  // counting records of result list
  const renderResultsPaneSubtitle = (result) => {
    if (result) {
      const count = result ? result.totalCount() : 0;
      return <FormattedMessage id="stripes-smart-components.searchResultsCountHeader" values={{ count }} />;
    }

    return <FormattedMessage id="stripes-smart-components.searchCriteria" />;
  };

  // button for creating a new record
  const renderResultsLastMenu = () => {
    if (disableRecordCreation) {
      return null;
    }

    return (
      <IfPermission perm="finc-config.metadata-sources.item.post">
        <PaneMenu>
          <FormattedMessage id="ui-finc-config.form.create">
            {ariaLabel => (
              <Button
                aria-label={ariaLabel}
                buttonStyle="primary"
                id="clickable-new-source"
                marginBottom0
                to={`${urls.sourceCreate()}${searchString}`}
              >
                <FormattedMessage id="stripes-smart-components.new" />
              </Button>
            )}
          </FormattedMessage>
        </PaneMenu>
      </IfPermission>
    );
  };

  const renderNavigation = (id) => (
    <FincNavigation
      id={id}
    />
  );

  const renderIsEmptyMessage = (query, result) => {
    if (!result) {
      return <FormattedMessage id="ui-finc-config.noSourceYet" />;
    }

    return (
      <div data-test-udps-no-results-message>
        <NoResultsMessage
          source={result}
          searchTerm={query.query || ''}
          filterPaneIsVisible
          toggleFilterPane={_.noop}
        />
      </div>
    );
  };

  const cacheFilter = (activeFilters, searchValue) => {
    localStorage.setItem('fincConfigSourceFilters', JSON.stringify(activeFilters));
    localStorage.setItem('fincConfigSourceSearchString', JSON.stringify(searchValue));
  };

  const resetAll = (getFilterHandlers, getSearchHandlers) => {
    localStorage.removeItem('fincConfigSourceFilters');
    localStorage.removeItem('fincConfigSourceSearchString');
    localStorage.removeItem('fincConfigSourceSearchIndex');

    // reset the filter state to default filters
    getFilterHandlers.state(defaultFilter.state);

    // reset the search query
    getSearchHandlers.state(defaultSearchString);

    setStoredFilter(defaultFilter);
    setStoredSearchString(defaultSearchString);
    setStoredSearchIndex(defaultSearchIndex);

    return (history.push(`${urls.sources()}?filters=${defaultFilter.string}`));
  };

  const handleClearSearch = (getSearchHandlers, onSubmitSearch, searchValue) => {
    localStorage.removeItem('fincConfigSourceSearchString');
    localStorage.removeItem('fincConfigSourceSearchIndex');

    setStoredSearchIndex(defaultSearchIndex);

    searchValue.query = '';

    getSearchHandlers.state({
      query: '',
      qindex: '',
    });

    return onSubmitSearch;
  };

  const handleChangeSearch = (e, getSearchHandlers) => {
    getSearchHandlers.state({
      query: e,
    });
  };

  const doChangeIndex = (index, getSearchHandlers, searchValue) => {
    localStorage.setItem('fincConfigSourceSearchIndex', JSON.stringify(index));
    setStoredSearchIndex(index);
    // call function in SourcesRoute.js:
    onChangeIndex(index);
    getSearchHandlers.state({
      query: searchValue.query,
      qindex: index,
    });
  };

  const getCombinedSearch = () => {
    if (storedSearchIndex.qindex !== '') {
      const combined = {
        query: storedSearchString.query,
        qindex: storedSearchIndex,
      };
      return combined;
    } else {
      return storedSearchString;
    }
  };

  const getDisableReset = (activeFilters, searchValue) => {
    if (_.isEqual(activeFilters.state, defaultFilter.state) && searchValue.query === defaultSearchString.query) {
      return true;
    } else {
      return false;
    }
  };

  const renderFilterPaneHeader = () => (
    <PaneHeader
      lastMenu={
        <PaneMenu>
          <CollapseFilterPaneButton onClick={toggleFilterPane} />
        </PaneMenu>
      }
      paneTitle={<FormattedMessage id="stripes-smart-components.searchAndFilter" />}
    />
  );


  const renderResultsPaneHeader = (activeFilters, result) => (
    <PaneHeader
      appIcon={<AppIcon app="finc-config" />}
      firstMenu={renderResultsFirstMenu(activeFilters)}
      lastMenu={renderResultsLastMenu()}
      paneTitle={<FormattedMessage id="ui-finc-config.sources.title" />}
      paneSub={renderResultsPaneSubtitle(result)}
    />
  );

  const count = source ? source.totalCount() : 0;
  const query = queryGetter() || {};
  const sortOrder = query.sort || '';

  if (!searchableIndexes) {
    searchableIndexes = rawSearchableIndexes.map(index => (
      { value: index.value, label: intl.formatMessage({ id: `ui-finc-config.source.search.${index.label}` }) }
    ));
  }

  return (
    <div data-test-sources data-testid="sources">
      <SearchAndSortQuery
        // NEED FILTER: {"status":["active","implementation","request"]}
        initialFilterState={storedFilter.state}
        initialSearchState={getCombinedSearch()}
        initialSortState={{ sort: 'label' }}
        queryGetter={queryGetter}
        querySetter={querySetter}
      >
        {
          ({
            activeFilters,
            filterChanged,
            getFilterHandlers,
            getSearchHandlers,
            onSort,
            onSubmitSearch,
            searchChanged,
            searchValue,
          }) => {
            const disableReset = getDisableReset(activeFilters, searchValue);
            const disableSearch = () => (searchValue.query === defaultSearchString.query);
            if (filterChanged || searchChanged) {
              cacheFilter(activeFilters, searchValue);
            }

            return (
              <Paneset>
                {filterPaneIsVisible &&
                  <Pane
                    data-test-source-pane-filter
                    defaultWidth="18%"
                    id="pane-sourcefilter"
                    renderHeader={renderFilterPaneHeader}
                  >
                    <form onSubmit={onSubmitSearch}>
                      {renderNavigation('source')}
                      <div>
                        <SearchField
                          ariaLabel={intl.formatMessage({ id: 'ui-finc-config.searchInputLabel' })}
                          autoFocus
                          id="sourceSearchField"
                          inputRef={searchField}
                          name="query"
                          onChange={(e) => {
                            if (e.target.value) {
                              handleChangeSearch(e.target.value, getSearchHandlers());
                            } else {
                              handleClearSearch(getSearchHandlers(), onSubmitSearch(), searchValue);
                            }
                          }}
                          onClear={() => handleClearSearch(getSearchHandlers(), onSubmitSearch(), searchValue)}
                          value={searchValue.query}
                          // add values for search-selectbox
                          onChangeIndex={(e) => { doChangeIndex(e.target.value, getSearchHandlers(), searchValue); }}
                          searchableIndexes={searchableIndexes}
                          selectedIndex={storedSearchIndex}
                        />
                        <Button
                          buttonStyle="primary"
                          disabled={disableSearch()}
                          fullWidth
                          id="sourceSubmitSearch"
                          type="submit"
                        >
                          <FormattedMessage id="stripes-smart-components.search" />
                        </Button>
                      </div>
                      <Button
                        buttonStyle="none"
                        disabled={disableReset}
                        id="clickable-reset-all"
                        onClick={() => resetAll(getFilterHandlers(), getSearchHandlers())}
                      >
                        <Icon icon="times-circle-solid">
                          <FormattedMessage id="stripes-smart-components.resetAll" />
                        </Icon>
                      </Button>
                      <SourceFilters
                        activeFilters={activeFilters.state}
                        filterData={filterData}
                        filterHandlers={getFilterHandlers()}
                      />
                    </form>
                  </Pane>
                }
                <Pane
                  data-test-source-pane-results
                  defaultWidth="fill"
                  id="pane-sourceresults"
                  padContent={false}
                  renderHeader={() => renderResultsPaneHeader(activeFilters, source)}
                >
                  <MultiColumnList
                    autosize
                    columnMapping={{
                      label: <FormattedMessage id="ui-finc-config.source.label" />,
                      sourceId: <FormattedMessage id="ui-finc-config.source.id" />,
                      status: <FormattedMessage id="ui-finc-config.source.status" />,
                      solrShard: <FormattedMessage id="ui-finc-config.source.solrShard" />,
                      lastProcessed: <FormattedMessage id="ui-finc-config.source.lastProcessed" />,
                    }}
                    contentData={contentData}
                    formatter={resultsFormatter}
                    id="list-sources"
                    isEmptyMessage={renderIsEmptyMessage(query, source)}
                    isSelected={({ item }) => item.id === selectedRecordId}
                    onHeaderClick={onSort}
                    onNeedMoreData={onNeedMoreData}
                    onRowClick={onSelectRow}
                    rowFormatter={rowFormatter}
                    sortDirection={
                      sortOrder.startsWith('-') ? 'descending' : 'ascending'
                    }
                    sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                    totalCount={count}
                    virtualize
                    visibleColumns={['label', 'sourceId', 'status', 'solrShard', 'lastProcessed']}
                  />
                </Pane>
                {children}
              </Paneset>
            );
          }
        }
      </SearchAndSortQuery>
    </div>
  );
};

MetadataSources.propTypes = {
  children: PropTypes.object,
  contentData: PropTypes.arrayOf(PropTypes.object),
  disableRecordCreation: PropTypes.bool,
  filterData: PropTypes.shape({
    contacts: PropTypes.arrayOf(PropTypes.object),
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }),
  onNeedMoreData: PropTypes.func,
  onSelectRow: PropTypes.func,
  queryGetter: PropTypes.func,
  querySetter: PropTypes.func,
  searchString: PropTypes.string,
  selectedRecordId: PropTypes.string,
  searchField: PropTypes.object,
  source: PropTypes.object,
  // add values for search-selectbox
  onChangeIndex: PropTypes.func,
  activeFilters: PropTypes.object,
};

MetadataSources.defaultProps = {
  contentData: {},
  filterData: {},
  searchString: '',
};

export default injectIntl(withRouter(MetadataSources));
