import _ from 'lodash';
import React from 'react';
import {
  withRouter,
  Link,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  CollapseFilterPaneButton,
  ExpandFilterPaneButton,
  SearchAndSortQuery,
} from '@folio/stripes/smart-components';
import {
  Button,
  Icon,
  MultiColumnList,
  Pane,
  PaneMenu,
  Paneset,
  SearchField,
} from '@folio/stripes/components';
import {
  AppIcon,
  IfPermission
} from '@folio/stripes/core';

import urls from '../DisplayUtils/urls';
import SourceFilters from './SourceFilters';
import FincNavigation from '../Navigation/FincNavigation';

const searchableIndexes = [
  { label: 'All', value: '', makeQuery: term => `(label="${term}*" or description="${term}*" or sourceId="${term}*")` },
  { label: 'Source Name', value: 'label', makeQuery: term => `(label="${term}*")` },
  { label: 'Description', value: 'description', makeQuery: term => `(description="${term}*")` },
  { label: 'Source ID', value: 'sourceId', makeQuery: term => `(sourceId="${term}*")` },
];

const defaultFilter = { state: { status: ['active', 'implementation'] }, string: 'status.active,status.implementation' };
const defaultSearchString = { query: '' };
const defaultSearchIndex = '';

class MetadataSources extends React.Component {
  static propTypes = {
    children: PropTypes.object,
    contentData: PropTypes.arrayOf(PropTypes.object),
    disableRecordCreation: PropTypes.bool,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    intl: PropTypes.object,
    onNeedMoreData: PropTypes.func,
    onSelectRow: PropTypes.func,
    packageInfo: PropTypes.shape({ // values pulled from the provider's package.json config object
      initialFilters: PropTypes.string, // default filters
      moduleName: PropTypes.string, // machine-readable, for HTML ids and translation keys
      stripes: PropTypes.shape({
        route: PropTypes.string, // base route; used to construct URLs
      }).isRequired,
      router: PropTypes.object,
    }),
    queryGetter: PropTypes.func,
    querySetter: PropTypes.func,
    searchString: PropTypes.string,
    source: PropTypes.object,
    // add values for search-selectbox
    onChangeIndex: PropTypes.func,
    selectedIndex: PropTypes.object,
    selectedRecordId: PropTypes.string,
    filterHandlers: PropTypes.object,
    activeFilters: PropTypes.object,
  };

  static defaultProps = {
    contentData: {},
    searchString: '',
  }

  constructor(props) {
    super(props);

    this.state = {
      filterPaneIsVisible: true,
      storedFilter: localStorage.getItem('fincConfigSourceFilters') ? JSON.parse(localStorage.getItem('fincConfigSourceFilters')) : defaultFilter,
      storedSearchString: localStorage.getItem('fincConfigSourceSearchString') ? JSON.parse(localStorage.getItem('fincConfigSourceSearchString')) : defaultSearchString,
      storedSearchIndex: localStorage.getItem('fincConfigSourceSearchIndex') ? JSON.parse(localStorage.getItem('fincConfigSourceSearchIndex')) : defaultSearchIndex,
    };
  }

  resultsFormatter = {
    label: source => source.label,
    sourceId: source => source.sourceId,
    status: source => source.status,
    solrShard: source => source.solrShard,
    lastProcessed: source => source.lastProcessed,
  };

  rowFormatter = (row) => {
    const { rowClass, rowData, rowIndex, rowProps = {}, cells } = row;
    let RowComponent;

    if (this.props.onSelectRow) {
      RowComponent = 'div';
    } else {
      RowComponent = Link;
      rowProps.to = this.rowURL(rowData.id);
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
  }

  // generate url for record-details
  rowURL = (id) => {
    return `${urls.sourceView(id)}${this.props.searchString}`;
    // NEED FILTER: "status.active,status.technical implementation,status.wish,status.negotiation"
  }

  // fade in/out of filter-pane
  toggleFilterPane = () => {
    this.setState(curState => ({
      filterPaneIsVisible: !curState.filterPaneIsVisible,
    }));
  }

  // fade in / out the filter menu
  renderResultsFirstMenu = (filters) => {
    const { filterPaneIsVisible } = this.state;
    const filterCount = filters.string !== '' ? filters.string.split(',').length : 0;
    if (filterPaneIsVisible) {
      return null;
    }

    return (
      <PaneMenu>
        <ExpandFilterPaneButton
          filterCount={filterCount}
          onClick={this.toggleFilterPane}
        />
      </PaneMenu>
    );
  }

  // counting records of result list
  renderResultsPaneSubtitle = (source) => {
    if (source) {
      const count = source ? source.totalCount() : 0;
      return <FormattedMessage id="stripes-smart-components.searchResultsCountHeader" values={{ count }} />;
    }

    return <FormattedMessage id="stripes-smart-components.searchCriteria" />;
  }

  // button for creating a new record
  renderResultsLastMenu() {
    if (this.props.disableRecordCreation) {
      return null;
    }

    return (
      <IfPermission perm="finc-config.metadata-sources.item.post">
        <PaneMenu>
          <FormattedMessage id="ui-finc-config.source.form.createSource">
            {ariaLabel => (
              <Button
                aria-label={ariaLabel}
                buttonStyle="primary"
                id="clickable-new-source"
                marginBottom0
                to={`${urls.sourceCreate()}${this.props.searchString}`}
              >
                <FormattedMessage id="stripes-smart-components.new" />
              </Button>
            )}
          </FormattedMessage>
        </PaneMenu>
      </IfPermission>
    );
  }

  renderNavigation = (id) => (
    <FincNavigation
      id={id}
    />
  );

  cacheFilter(activeFilters, searchValue) {
    localStorage.setItem('fincConfigSourceFilters', JSON.stringify(activeFilters));
    localStorage.setItem('fincConfigSourceSearchString', JSON.stringify(searchValue));
  }

  resetAll(getFilterHandlers, getSearchHandlers) {
    localStorage.removeItem('fincConfigSourceFilters');
    localStorage.removeItem('fincConfigSourceSearchString');
    localStorage.removeItem('fincConfigSourceSearchIndex');

    // reset the filter state to default filters
    getFilterHandlers.state(defaultFilter.state);

    // reset the search query
    getSearchHandlers.state(defaultSearchString);

    this.setState({
      storedFilter: defaultFilter,
      storedSearchString: defaultSearchString,
      storedSearchIndex: defaultSearchIndex,
    });

    return (this.props.history.push(`${urls.sources()}?filters=${defaultFilter.string}`));
  }

  handleClearSearch(getSearchHandlers, onSubmitSearch, searchValue) {
    localStorage.removeItem('fincConfigSourceSearchString');
    localStorage.removeItem('fincConfigSourceSearchIndex');

    this.setState({ storedSearchIndex: defaultSearchIndex });

    searchValue.query = '';

    getSearchHandlers.state({
      query: '',
      qindex: '',
    });

    return onSubmitSearch;
  }

  handleChangeSearch(e, getSearchHandlers) {
    getSearchHandlers.state({
      query: e,
    });
  }

  onChangeIndex(index, getSearchHandlers, searchValue) {
    localStorage.setItem('fincConfigSourceSearchIndex', JSON.stringify(index));
    this.setState({ storedSearchIndex: index });
    // call function in SourcesRoute.js:
    this.props.onChangeIndex(index);
    getSearchHandlers.state({
      query: searchValue.query,
      qindex: index,
    });
  }

  getCombinedSearch = () => {
    if (this.state.storedSearchIndex.qindex !== '') {
      const combined = {
        query: this.state.storedSearchString.query,
        qindex: this.state.storedSearchIndex,
      };
      return combined;
    } else {
      return this.state.storedSearchString;
    }
  }

  getDisableReset(activeFilters, searchValue) {
    if (_.isEqual(activeFilters.state, defaultFilter.state) && searchValue.query === defaultSearchString.query) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const { queryGetter, querySetter, onNeedMoreData, onSelectRow, selectedRecordId, source } = this.props;
    const count = source ? source.totalCount() : 0;
    const query = queryGetter() || {};
    const sortOrder = query.sort || '';

    return (
      <div data-test-sources>
        <SearchAndSortQuery
          // NEED FILTER: {"status":["active","implementation","wish"]}
          initialFilterState={this.state.storedFilter.state}
          initialSearchState={this.getCombinedSearch()}
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
              const disableReset = this.getDisableReset(activeFilters, searchValue);
              const disableSearch = () => (searchValue.query === defaultSearchString.query);
              if (filterChanged || searchChanged) {
                this.cacheFilter(activeFilters, searchValue);
              }

              return (
                <Paneset>
                  {this.state.filterPaneIsVisible &&
                    <Pane
                      data-test-source-pane-filter
                      defaultWidth="18%"
                      id="pane-sourcefilter"
                      lastMenu={
                        <PaneMenu>
                          <CollapseFilterPaneButton
                            onClick={this.toggleFilterPane}
                          />
                        </PaneMenu>
                      }
                      paneTitle={<FormattedMessage id="stripes-smart-components.searchAndFilter" />}
                    >
                      <form onSubmit={onSubmitSearch}>
                        {this.renderNavigation('source')}
                        <div>
                          <FormattedMessage id="ui-finc-config.source.searchInputLabel">
                            {ariaLabel => (
                              <SearchField
                                ariaLabel={ariaLabel}
                                autoFocus
                                id="sourceSearchField"
                                inputRef={this.searchField}
                                name="query"
                                onChange={(e) => {
                                  if (e.target.value) {
                                    this.handleChangeSearch(e.target.value, getSearchHandlers());
                                  } else {
                                    this.handleClearSearch(getSearchHandlers(), onSubmitSearch(), searchValue);
                                  }
                                }}
                                onClear={() => this.handleClearSearch(getSearchHandlers(), onSubmitSearch(), searchValue)}
                                value={searchValue.query}
                                // add values for search-selectbox
                                onChangeIndex={(e) => { this.onChangeIndex(e.target.value, getSearchHandlers(), searchValue); }}
                                searchableIndexes={searchableIndexes}
                                searchableIndexesPlaceholder={null}
                                selectedIndex={this.state.storedSearchIndex}
                              />
                            )}
                          </FormattedMessage>
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
                          onClick={() => this.resetAll(getFilterHandlers(), getSearchHandlers())}
                        >
                          <Icon icon="times-circle-solid">
                            <FormattedMessage id="stripes-smart-components.resetAll" />
                          </Icon>
                        </Button>
                        <SourceFilters
                          activeFilters={activeFilters.state}
                          filterHandlers={getFilterHandlers()}
                        />
                      </form>
                    </Pane>
                  }
                  <Pane
                    appIcon={<AppIcon app="finc-config" />}
                    data-test-source-pane-results
                    defaultWidth="fill"
                    firstMenu={this.renderResultsFirstMenu(activeFilters)}
                    id="pane-sourceresults"
                    lastMenu={this.renderResultsLastMenu()}
                    padContent={false}
                    paneTitle={<FormattedMessage id="ui-finc-config.sources.title" />}
                    paneSub={this.renderResultsPaneSubtitle(source)}
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
                      contentData={this.props.contentData}
                      formatter={this.resultsFormatter}
                      id="list-sources"
                      isEmptyMessage="no results"
                      isSelected={({ item }) => item.id === selectedRecordId}
                      onHeaderClick={onSort}
                      onNeedMoreData={onNeedMoreData}
                      onRowClick={onSelectRow}
                      rowFormatter={this.rowFormatter}
                      sortDirection={
                        sortOrder.startsWith('-') ? 'descending' : 'ascending'
                      }
                      sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                      totalCount={count}
                      virtualize
                      visibleColumns={['label', 'sourceId', 'status', 'solrShard', 'lastProcessed']}
                    />
                  </Pane>
                  {this.props.children}
                </Paneset>
              );
            }
          }
        </SearchAndSortQuery>
      </div>
    );
  }
}

export default withRouter(MetadataSources);
