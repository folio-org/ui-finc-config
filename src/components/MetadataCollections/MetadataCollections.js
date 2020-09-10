import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Link,
  withRouter,
} from 'react-router-dom';
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
  NoValue,
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
import CollectionFilters from './CollectionFilters';
import FincNavigation from '../Navigation/FincNavigation';
import metadataAvailableOptions from '../DataOptions/metadataAvailable';
import usageRestrictedOptions from '../DataOptions/usageRestricted';
import freeContentOptions from '../DataOptions/freeContent';

const searchableIndexes = [
  { label: 'All', value: '', makeQuery: term => `(label="${term}*" or description="${term}*" or collectionId="${term}*")` },
  { label: 'Collection Name', value: 'label', makeQuery: term => `(label="${term}*")` },
  { label: 'Description', value: 'description', makeQuery: term => `(description="${term}*")` },
  { label: 'Collection ID', value: 'collectionId', makeQuery: term => `(collectionId="${term}*")` },
];
const defaultFilter = { state: { metadataAvailable: ['yes'] }, string: 'metadataAvailable.yes' };
const defaultSearchString = { query: '' };
const defaultSearchIndex = '';

class MetadataCollections extends React.Component {
  static propTypes = {
    children: PropTypes.object,
    collection: PropTypes.object,
    contentData: PropTypes.arrayOf(PropTypes.object),
    disableRecordCreation: PropTypes.bool,
    filterData: PropTypes.shape({
      mdSources: PropTypes.array,
    }),
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    onNeedMoreData: PropTypes.func,
    onSelectRow: PropTypes.func,
    // packageInfo: PropTypes.shape({ // values pulled from the provider's package.json config object
    //   initialFilters: PropTypes.string, // default filters
    //   moduleName: PropTypes.string, // machine-readable, for HTML ids and translation keys
    //   stripes: PropTypes.shape({
    //     route: PropTypes.string, // base route; used to construct URLs
    //   }).isRequired,
    // }),
    queryGetter: PropTypes.func,
    querySetter: PropTypes.func,
    searchString: PropTypes.string,
    selectedRecordId: PropTypes.string,
    // add values for search-selectbox
    onChangeIndex: PropTypes.func,
    // selectedIndex: PropTypes.object,
    // selectedRecordId: PropTypes.string,
    // filterHandlers: PropTypes.object,
    activeFilters: PropTypes.object,
  };

  static defaultProps = {
    contentData: {},
    filterData: {},
    searchString: '',
  }

  constructor(props) {
    super(props);

    this.state = {
      filterPaneIsVisible: true,
      storedFilter: localStorage.getItem('fincConfigCollectionFilters') ? JSON.parse(localStorage.getItem('fincConfigCollectionFilters')) : defaultFilter,
      storedSearchString: localStorage.getItem('fincConfigCollectionSearchString') ? JSON.parse(localStorage.getItem('fincConfigCollectionSearchString')) : defaultSearchString,
      storedSearchIndex: localStorage.getItem('fincConfigCollectionSearchIndex') ? JSON.parse(localStorage.getItem('fincConfigCollectionSearchIndex')) : defaultSearchIndex,
    };
  }

  getMetadataAvailableLabel(metadataAvailableValue) {
    const dataWithMetadataAvailableValue = metadataAvailableOptions.find(
      (e) => e.value === metadataAvailableValue
    );
    const metadataAvailableLabel = _.get(dataWithMetadataAvailableValue, 'label', <NoValue />);

    return metadataAvailableLabel;
  }

  getUsageRestrictedLabel(usageRestrictedValue) {
    const dataWithUsageRestrictedValue = usageRestrictedOptions.find(
      (e) => e.value === usageRestrictedValue
    );
    const usageRestrictedLabel = _.get(dataWithUsageRestrictedValue, 'label', <NoValue />);

    return usageRestrictedLabel;
  }

  getFreeContentLabel(freeContentValue) {
    const dataWithFreeContentValue = freeContentOptions.find(
      (e) => e.value === freeContentValue
    );
    const freeContentLabel = _.get(dataWithFreeContentValue, 'label', <NoValue />);

    return freeContentLabel;
  }

  resultsFormatter = {
    label: collection => collection.label,
    mdSource: collection => collection.mdSource.name,
    metadataAvailable: collection => this.getMetadataAvailableLabel(collection.metadataAvailable),
    usageRestricted: collection => this.getUsageRestrictedLabel(collection.usageRestricted),
    permittedFor: collection => collection.permittedFor.join('; '),
    freeContent: collection => this.getFreeContentLabel(collection.freeContent),
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
    return `${urls.collectionView(id)}${this.props.searchString}`;
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
  renderResultsPaneSubtitle = (collection) => {
    if (collection) {
      const count = collection ? collection.totalCount() : 0;
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
      <IfPermission perm="finc-config.metadata-collections.item.post">
        <PaneMenu>
          <FormattedMessage id="ui-finc-config.form.create">
            {ariaLabel => (
              <Button
                aria-label={ariaLabel}
                buttonStyle="primary"
                id="clickable-new-collection"
                marginBottom0
                to={`${urls.collectionCreate()}${this.props.searchString}`}
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
    localStorage.setItem('fincConfigCollectionFilters', JSON.stringify(activeFilters));
    localStorage.setItem('fincConfigCollectionSearchString', JSON.stringify(searchValue));
  }

  resetAll(getFilterHandlers, getSearchHandlers) {
    localStorage.removeItem('fincConfigCollectionFilters');
    localStorage.removeItem('fincConfigCollectionSearchString');
    localStorage.removeItem('fincConfigCollectionSearchIndex');

    // reset the filter state to default filters
    getFilterHandlers.state(defaultFilter.state);

    // reset the search query
    getSearchHandlers.state(defaultSearchString);

    this.setState({
      storedFilter: defaultFilter,
      storedSearchString: defaultSearchString,
      storedSearchIndex: defaultSearchIndex,
    });

    return (this.props.history.push(`${urls.collections()}?filters=${defaultFilter.string}`));
  }

  // function is handling click on delete Search-buttton
  handleClearSearch(getSearchHandlers, onSubmitSearch, searchValue) {
    localStorage.removeItem('fincConfigCollectionSearchString');
    localStorage.removeItem('fincConfigCollectionSearchIndex');

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
    localStorage.setItem('fincConfigCollectionSearchIndex', JSON.stringify(index));
    this.setState({ storedSearchIndex: index });
    // call function in CollectionsRoute.js:
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
    const { queryGetter, querySetter, onNeedMoreData, onSelectRow, selectedRecordId, collection, filterData } = this.props;
    const count = collection ? collection.totalCount() : 0;
    const query = queryGetter() || {};
    const sortOrder = query.sort || '';

    return (
      <div data-test-collections>
        <SearchAndSortQuery
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
                      data-test-collection-pane-filter
                      defaultWidth="18%"
                      id="pane-collectionfilter"
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
                        {this.renderNavigation('collection')}
                        <div>
                          <FormattedMessage id="ui-finc-config.searchInputLabel">
                            {ariaLabel => (
                              <SearchField
                                ariaLabel={ariaLabel}
                                autoFocus
                                id="collectionSearchField"
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
                          onClick={() => this.resetAll(getFilterHandlers(), getSearchHandlers())}
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
                    appIcon={<AppIcon app="finc-config" />}
                    data-test-collection-pane-results
                    defaultWidth="fill"
                    firstMenu={this.renderResultsFirstMenu(activeFilters)}
                    id="pane-collectionresults"
                    lastMenu={this.renderResultsLastMenu()}
                    padContent={false}
                    paneTitle={<FormattedMessage id="ui-finc-config.collections.title" />}
                    paneSub={this.renderResultsPaneSubtitle(collection)}
                  >
                    <MultiColumnList
                      autosize
                      columnMapping={{
                        label: <FormattedMessage id="ui-finc-config.collection.label" />,
                        mdSource: <FormattedMessage id="ui-finc-config.collection.mdSource" />,
                        metadataAvailable: <FormattedMessage id="ui-finc-config.collection.metadataAvailable" />,
                        usageRestricted: <FormattedMessage id="ui-finc-config.collection.usageRestricted" />,
                        permittedFor: <FormattedMessage id="ui-finc-config.collection.permittedFor" />,
                        freeContent: <FormattedMessage id="ui-finc-config.collection.freeContent" />,
                      }}
                      contentData={this.props.contentData}
                      formatter={this.resultsFormatter}
                      id="list-collections"
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
                      visibleColumns={['label', 'mdSource', 'metadataAvailable', 'usageRestricted', 'permittedFor', 'freeContent']}
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

export default withRouter(MetadataCollections);
