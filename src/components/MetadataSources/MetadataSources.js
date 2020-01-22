import React from 'react';
import {
  withRouter,
  Link,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
  intlShape
} from 'react-intl';

import {
  SearchAndSortQuery,
  SearchAndSortSearchButton as FilterPaneToggle,
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
  { label: 'All', value: '', makeQuery: term => `(label="${term}*" or sourceId="${term}*")` },
  { label: 'Source Name', value: 'label', makeQuery: term => `(label="${term}*")` },
  { label: 'Source ID', value: 'sourceId', makeQuery: term => `(sourceId="${term}*")` }
];

const defaultFilter = { state: { status: ['active', 'technical implementation'] }, string: 'status.active,status.technical implementation' };
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
    intl: intlShape.isRequired,
    onSearchChange: PropTypes.func.isRequired,
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

  constructor(props, context) {
    super(props, context);

    this.state = {
      filterPaneIsVisible: true,
      storedFilter: localStorage.getItem('fincConfigSourceFilters') ? JSON.parse(localStorage.getItem('fincConfigSourceFilters')) : defaultFilter,
      storedSearchString: localStorage.getItem('fincConfigSourceSearchString') ? JSON.parse(localStorage.getItem('fincConfigSourceSearchString')) : defaultSearchString,
      storedSearchIndex: localStorage.getItem('fincConfigSourceSearchIndex') ? JSON.parse(localStorage.getItem('fincConfigSourceSearchIndex')) : defaultSearchIndex,
    };

    this.cacheFilter = this.cacheFilter.bind(this);
    this.resetAll = this.resetAll.bind(this);
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
    // return `${urls.sourceView(id)}${this.state.storedSearchString}`;
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
    const hideOrShowMessageId = filterPaneIsVisible ?
      'stripes-smart-components.hideSearchPane' : 'stripes-smart-components.showSearchPane';

    return (
      <PaneMenu>
        <FormattedMessage id="stripes-smart-components.numberOfFilters" values={{ count: filterCount }}>
          {appliedFiltersMessage => (
            <FormattedMessage id={hideOrShowMessageId}>
              {hideOrShowMessage => (
                <FilterPaneToggle
                  aria-label={`${hideOrShowMessage}...${appliedFiltersMessage}`}
                  onClick={this.toggleFilterPane}
                  visible={filterPaneIsVisible}
                />
              )}
            </FormattedMessage>
          )}
        </FormattedMessage>
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

    // TODO: url still contains old qindex?!
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

  render() {
    const { intl, queryGetter, querySetter, onSelectRow, selectedRecordId, source } = this.props;
    const count = source ? source.totalCount() : 0;

    return (
      <div data-test-sources>
        <SearchAndSortQuery
          // initialFilterState={defaultFilter}
          // NEED FILTER: {"status":["active","technical implementation","wish"]}
          initialFilterState={this.state.storedFilter.state}
          // initialSearchState={{ query: '' }}
          // initialSearchState={this.state.storedSearchString}
          // TODO: initialSearchState has to look like:
          // initialSearchState={{ 'query': 'music', 'qindex': 'label' }}
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
              resetAll,
              searchChanged,
              searchValue,
            }) => {
              // const disableReset = () => (!filterChanged && !searchChanged);
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
                      onClose={this.toggleFilterPane}
                      paneTitle={<FormattedMessage id="stripes-smart-components.searchAndFilter" />}
                    >
                      <form onSubmit={onSubmitSearch}>
                        {this.renderNavigation('source')}
                        <div>
                          <SearchField
                            autoFocus
                            id="sourceSearchField"
                            inputRef={this.searchField}
                            name="query"
                            onChange={getSearchHandlers().query}
                            // onClear={getSearchHandlers().reset}
                            onClear={() => this.handleClearSearch(getSearchHandlers(), onSubmitSearch(), searchValue)}
                            value={searchValue.query}
                            // add values for search-selectbox
                            // onChangeIndex={onChangeIndex}
                            onChangeIndex={(e) => { this.onChangeIndex(e.target.value, getSearchHandlers(), searchValue); }}
                            searchableIndexes={searchableIndexes}
                            searchableIndexesPlaceholder={null}
                            // selectedIndex={_.get(this.props.contentData, 'qindex')}
                            selectedIndex={this.state.storedSearchIndex}
                          />
                          <Button
                            buttonStyle="primary"
                            // disabled={!searchValue.query || searchValue.query === ''}
                            fullWidth
                            id="sourceSubmitSearch"
                            type="submit"
                          >
                            <FormattedMessage id="stripes-smart-components.search" />
                          </Button>
                        </div>
                        <Button
                          buttonStyle="none"
                          // TODO: get disabled working?!
                          // disabled={disableReset()}
                          id="clickable-reset-all"
                          // onClick={resetAll}

                          onClick={() => this.resetAll(getFilterHandlers(), getSearchHandlers(), resetAll)}
                          // to={`${urls.sources()}?filters=status.active%2Cstatus.technical%20implementation&query=`}
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
                    paneTitle="Finc Config"
                    paneSub={this.renderResultsPaneSubtitle(source)}
                  >
                    <MultiColumnList
                      autosize
                      columnMapping={{
                        label: intl.formatMessage({ id: 'ui-finc-config.source.label' }),
                        sourceId: intl.formatMessage({ id: 'ui-finc-config.source.id' }),
                        status: intl.formatMessage({ id: 'ui-finc-config.source.status' }),
                        solrShard: intl.formatMessage({ id: 'ui-finc-config.source.solrShard' }),
                        lastProcessed: intl.formatMessage({ id: 'ui-finc-config.source.lastProcessed' }),
                      }}
                      contentData={this.props.contentData}
                      formatter={this.resultsFormatter}
                      id="list-sources"
                      isEmptyMessage="no results"
                      isSelected={({ item }) => item.id === selectedRecordId}
                      onHeaderClick={onSort}
                      onRowClick={onSelectRow}
                      rowFormatter={this.rowFormatter}
                      // selectedRow={this.state.selectedItem}
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

export default withRouter(injectIntl(MetadataSources));
