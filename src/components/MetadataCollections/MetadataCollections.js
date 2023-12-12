import _ from 'lodash';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Link,
  withRouter,
} from 'react-router-dom';
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
  IfPermission
} from '@folio/stripes/core';

import urls from '../DisplayUtils/urls';
import CollectionFilters from './CollectionFilters';
import FincNavigation from '../Navigation/FincNavigation';

const rawSearchableIndexes = [
  { label: 'all', value: '', makeQuery: term => `(label="${term}*" or description="${term}*" or collectionId="${term}*")` },
  { label: 'label', value: 'label', makeQuery: term => `(label="${term}*")` },
  { label: 'description', value: 'description', makeQuery: term => `(description="${term}*")` },
  { label: 'collectionId', value: 'collectionId', makeQuery: term => `(collectionId="${term}*")` },
];
let searchableIndexes;

const defaultFilter = { state: { metadataAvailable: ['yes'] }, string: 'metadataAvailable.yes' };
const defaultSearchString = { query: '' };
const defaultSearchIndex = '';

const MetadataCollections = ({
  children,
  collection,
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
  // add values for search-selectbox
  onChangeIndex,
}) => {
  const [filterPaneIsVisible, setFilterPaneIsVisible] = useState(true);

  const [storedFilter, setStoredFilter] = useState(
    localStorage.getItem('fincConfigCollectionFilters') ? JSON.parse(localStorage.getItem('fincConfigCollectionFilters')) : defaultFilter
  );
  const [storedSearchString, setStoredSearchString] = useState(
    localStorage.getItem('fincConfigCollectionSearchString') ? JSON.parse(localStorage.getItem('fincConfigCollectionSearchString')) : defaultSearchString
  );
  const [storedSearchIndex, setStoredSearchIndex] = useState(
    localStorage.getItem('fincConfigCollectionSearchIndex') ? JSON.parse(localStorage.getItem('fincConfigCollectionSearchIndex')) : defaultSearchIndex
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
    mdSource: result => result.mdSource.name,
    metadataAvailable: result => getDataLable(_.get(result, 'metadataAvailable', '')),
    usageRestricted: result => getDataLable(_.get(result, 'usageRestricted', '')),
    permittedFor: result => result.permittedFor.join('; '),
    freeContent: result => getDataLable(_.get(result, 'freeContent', '')),
  };

  // generate url for record-details
  const rowURL = (id) => {
    return `${urls.collectionView(id)}${searchString}`;
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
  const renderResultsPaneSubtitle = (col) => {
    if (col) {
      const count = col ? col.totalCount() : 0;
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
      <IfPermission perm="finc-config.metadata-collections.item.post">
        <PaneMenu>
          <FormattedMessage id="ui-finc-config.form.create">
            {ariaLabel => (
              <Button
                aria-label={ariaLabel}
                buttonStyle="primary"
                id="clickable-new-collection"
                marginBottom0
                to={`${urls.collectionCreate()}${searchString}`}
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

  const renderIsEmptyMessage = (query, source) => {
    if (!source) {
      return <FormattedMessage id="ui-finc-config.noSourceYet" />;
    }

    return (
      <div data-test-udps-no-results-message>
        <NoResultsMessage
          source={source}
          searchTerm={query.query || ''}
          filterPaneIsVisible
          toggleFilterPane={_.noop}
        />
      </div>
    );
  };

  const cacheFilter = (activeFilters, searchValue) => {
    localStorage.setItem('fincConfigCollectionFilters', JSON.stringify(activeFilters));
    localStorage.setItem('fincConfigCollectionSearchString', JSON.stringify(searchValue));
  };

  const resetAll = (getFilterHandlers, getSearchHandlers) => {
    localStorage.removeItem('fincConfigCollectionFilters');
    localStorage.removeItem('fincConfigCollectionSearchString');
    localStorage.removeItem('fincConfigCollectionSearchIndex');

    // reset the filter state to default filters
    getFilterHandlers.state(defaultFilter.state);

    // reset the search query
    getSearchHandlers.state(defaultSearchString);

    setStoredFilter(defaultFilter);
    setStoredSearchString(defaultSearchString);
    setStoredSearchIndex(defaultSearchIndex);

    return (history.push(`${urls.collections()}?filters=${defaultFilter.string}`));
  };

  // function is handling click on delete Search-buttton
  const handleClearSearch = (getSearchHandlers, onSubmitSearch, searchValue) => {
    localStorage.removeItem('fincConfigCollectionSearchString');
    localStorage.removeItem('fincConfigCollectionSearchIndex');

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
    localStorage.setItem('fincConfigCollectionSearchIndex', JSON.stringify(index));
    setStoredSearchIndex(index);

    // call function in CollectionsRoute.js:
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

  const getColumnMapping = () => {
    const columnMapping = {
      label: intl.formatMessage({ id: 'ui-finc-config.collection.label' }),
      mdSource: intl.formatMessage({ id: 'ui-finc-config.collection.mdSource' }),
      metadataAvailable: intl.formatMessage({ id: 'ui-finc-config.collection.metadataAvailable' }),
      usageRestricted: intl.formatMessage({ id: 'ui-finc-config.collection.usageRestricted' }),
      permittedFor: intl.formatMessage({ id: 'ui-finc-config.collection.permittedFor' }),
      freeContent: intl.formatMessage({ id: 'ui-finc-config.collection.freeContent' }),
    };

    return columnMapping;
  };

  const getVisibleColumns = () => {
    const visibleColumns = ['label', 'mdSource', 'metadataAvailable', 'usageRestricted', 'permittedFor', 'freeContent'];

    return visibleColumns;
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

  const renderResultsPaneHeader = (activeFilters, col) => (
    <PaneHeader
      appIcon={<AppIcon app="finc-config" />}
      firstMenu={renderResultsFirstMenu(activeFilters)}
      lastMenu={renderResultsLastMenu()}
      paneTitle={<FormattedMessage id="ui-finc-config.collections.title" />}
      paneSub={renderResultsPaneSubtitle(col)}
    />
  );

  const count = collection ? collection.totalCount() : 0;
  const query = queryGetter() || {};
  const sortOrder = query.sort || '';
  const visibleColumns = getVisibleColumns();
  const columnMapping = getColumnMapping();

  if (!searchableIndexes) {
    searchableIndexes = rawSearchableIndexes.map(index => (
      { value: index.value, label: intl.formatMessage({ id: `ui-finc-config.collection.search.${index.label}` }) }
    ));
  }

  return (
    <div data-test-collections data-testid="collections">
      <SearchAndSortQuery
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
                    data-test-collection-pane-filter
                    defaultWidth="18%"
                    id="pane-collectionfilter"
                    renderHeader={renderFilterPaneHeader}
                  >
                    <form onSubmit={onSubmitSearch}>
                      {renderNavigation('collection')}
                      <div>
                        <SearchField
                          ariaLabel={intl.formatMessage({ id: 'ui-finc-config.searchInputLabel' })}
                          autoFocus
                          id="collectionSearchField"
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
                          id="collectionSubmitSearch"
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
                      <CollectionFilters
                        activeFilters={activeFilters.state}
                        filterData={filterData}
                        filterHandlers={getFilterHandlers()}
                      />
                    </form>
                  </Pane>
                }
                <Pane
                  data-test-collection-pane-results
                  defaultWidth="fill"
                  id="pane-collectionresults"
                  padContent={false}
                  renderHeader={() => renderResultsPaneHeader(activeFilters, collection)}
                >
                  <MultiColumnList
                    autosize
                    columnMapping={columnMapping}
                    contentData={contentData}
                    formatter={resultsFormatter}
                    id="list-collections"
                    isEmptyMessage={renderIsEmptyMessage(query, collection)}
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
                    visibleColumns={visibleColumns}
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

MetadataCollections.propTypes = {
  children: PropTypes.object,
  collection: PropTypes.object,
  contentData: PropTypes.arrayOf(PropTypes.object),
  disableRecordCreation: PropTypes.bool,
  filterData: PropTypes.shape({
    mdSources: PropTypes.arrayOf(PropTypes.object),
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
  // add values for search-selectbox
  onChangeIndex: PropTypes.func,
  activeFilters: PropTypes.object,
};

MetadataCollections.defaultProps = {
  contentData: { mdSources: [] },
  filterData: {},
  searchString: '',
};

export default injectIntl(withRouter(MetadataCollections));
