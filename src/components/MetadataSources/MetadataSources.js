import {
  get,
  isEqual,
  noop,
} from 'lodash';
import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import {
  Link,
  withRouter,
} from 'react-router-dom';

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
import {
  CollapseFilterPaneButton,
  ExpandFilterPaneButton,
  SearchAndSortNoResultsMessage as NoResultsMessage,
  SearchAndSortQuery,
} from '@folio/stripes/smart-components';

import urls from '../DisplayUtils/urls';
import FincNavigation from '../Navigation/FincNavigation';
import SourceFilters from './SourceFilters';

const rawSearchableIndexes = [
  { label: 'all', value: '', makeQuery: term => `(label="${term}*" or description="${term}*" or sourceId="${term}*")` },
  { label: 'label', value: 'label', makeQuery: term => `(label="${term}*")` },
  { label: 'description', value: 'description', makeQuery: term => `(description="${term}*")` },
  { label: 'sourceId', value: 'sourceId', makeQuery: term => `(sourceId="${term}*")` },
];
let searchableIndexes;

const defaultFilter = { status: ['active', 'implementation'] };
const defaultSearch = { query: '', qindex: '' };
const defaultSort = { sort: 'label' };

const MetadataSources = ({
  children,
  contentData = {},
  disableRecordCreation,
  filterData = {},
  intl,
  // add values for search-selectbox
  onChangeIndex,
  onNeedMoreData,
  onSelectRow,
  queryGetter,
  querySetter,
  searchField,
  searchString = '',
  selectedRecordId,
  source,
}) => {
  const [filterPaneIsVisible, setFilterPaneIsVisible] = useState(true);

  const getDataLabel = (fieldValue) => {
    if (fieldValue !== '') {
      return <FormattedMessage id={`ui-finc-config.dataOption.${fieldValue}`} />;
    } else {
      return <NoValue />;
    }
  };

  const resultsFormatter = {
    label: result => result.label,
    sourceId: result => result.sourceId,
    status: result => getDataLabel(get(result, 'status', '')),
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
        key={`row-${rowIndex}`}
        aria-rowindex={rowIndex + 2}
        className={rowClass}
        data-label={[rowData.name]}
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
          filterPaneIsVisible
          searchTerm={query.query || ''}
          source={result}
          toggleFilterPane={noop}
        />
      </div>
    );
  };

  const storeSearchString = () => {
    localStorage.setItem('finc-config-sources-search-string', searchString);
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
      paneSub={renderResultsPaneSubtitle(result)}
      paneTitle={<FormattedMessage id="ui-finc-config.sources.title" />}
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
        initialFilterState={defaultFilter}
        initialSearchState={defaultSearch}
        initialSortState={defaultSort}
        queryGetter={queryGetter}
        querySetter={querySetter}
        searchParamsMapping={{
          query: (q) => ({ query: q }),
          qindex: (q) => ({ qindex: q }),
        }}
        setQueryOnMount
      >
        {
          ({
            activeFilters,
            getFilterHandlers,
            getSearchHandlers,
            onSort,
            onSubmitSearch,
            resetAll,
            searchValue,
          }) => {
            const doChangeIndex = (e) => {
              onChangeIndex(e.target.value);
              getSearchHandlers().query(e);
            };

            const filterChanged = !isEqual(activeFilters.state, defaultFilter);
            const searchChanged = searchValue.query && !isEqual(searchValue, defaultSearch);

            storeSearchString();

            return (
              <Paneset>
                {filterPaneIsVisible &&
                  <Pane
                    data-test-source-pane-filter
                    defaultWidth="18%"
                    id="pane-source-filter"
                    renderHeader={renderFilterPaneHeader}
                  >
                    <form onSubmit={onSubmitSearch}>
                      {renderNavigation('source')}
                      <div>
                        <SearchField
                          ariaLabel={intl.formatMessage({ id: 'ui-finc-config.searchInputLabel' })}
                          autoFocus
                          id="sourceSearchField"
                          indexName="qindex"
                          inputRef={searchField}
                          name="query"
                          onChange={(e) => {
                            if (e.target.value) {
                              getSearchHandlers().query(e);
                            } else {
                              getSearchHandlers().reset();
                            }
                          }}
                          onChangeIndex={doChangeIndex}
                          onClear={getSearchHandlers().reset}
                          // add values for search-selectbox
                          searchableIndexes={searchableIndexes}
                          selectedIndex={searchValue.qindex}
                          value={searchValue.query}
                        />
                        <Button
                          buttonStyle="primary"
                          disabled={!searchChanged}
                          fullWidth
                          id="sourceSubmitSearch"
                          type="submit"
                        >
                          <FormattedMessage id="stripes-smart-components.search" />
                        </Button>
                      </div>
                      <Button
                        buttonStyle="none"
                        disabled={!(filterChanged || searchChanged)}
                        id="clickable-reset-all"
                        onClick={resetAll}
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
                  id="pane-source-results"
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
  activeFilters: PropTypes.object,
  children: PropTypes.object,
  contentData: PropTypes.arrayOf(PropTypes.object),
  disableRecordCreation: PropTypes.bool,
  filterData: PropTypes.shape({
    contacts: PropTypes.arrayOf(PropTypes.object),
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }),
  // add values for search-selectbox
  onChangeIndex: PropTypes.func,
  onNeedMoreData: PropTypes.func,
  onSelectRow: PropTypes.func,
  queryGetter: PropTypes.func,
  querySetter: PropTypes.func,
  searchField: PropTypes.object,
  searchString: PropTypes.string,
  selectedRecordId: PropTypes.string,
  source: PropTypes.object,
};

export default injectIntl(withRouter(MetadataSources));
