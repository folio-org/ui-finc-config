import {
  get,
  isEqual,
} from 'lodash';
import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import { withRouter } from 'react-router-dom';

import {
  Button,
  Icon,
  MultiColumnList,
  Pane,
  Paneset,
  SearchField,
} from '@folio/stripes/components';
import { SearchAndSortQuery } from '@folio/stripes/smart-components';

import {
  createRowFormatter,
  createRowURL,
  getDataLabel,
  renderFilterPaneHeader,
  renderIsEmptyMessage,
  renderNavigation,
  renderResultsPaneHeader,
} from '../DisplayUtils/renderListUtils';
import urls from '../DisplayUtils/urls';
import CollectionFilters from './CollectionFilters';

let searchableIndexes;
const defaultFilter = { metadataAvailable: ['yes'] };
const defaultSearch = { query: '', qindex: '' };
const defaultSort = { sort: 'label' };

const rawSearchableIndexes = [
  // eslint-disable-next-line max-len
  { label: 'all', value: '', makeQuery: term => `(label="${term}*" or description="${term}*" or collectionId="${term}*")` },
  { label: 'label', value: 'label', makeQuery: term => `(label="${term}*")` },
  { label: 'description', value: 'description', makeQuery: term => `(description="${term}*")` },
  { label: 'collectionId', value: 'collectionId', makeQuery: term => `(collectionId="${term}*")` },
];

const MetadataCollections = ({
  children,
  collection,
  contentData = { mdSources: [] },
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
}) => {
  const [filterPaneIsVisible, setFilterPaneIsVisible] = useState(true);

  const resultsFormatter = {
    label: result => result.label,
    mdSource: result => result.mdSource.name,
    metadataAvailable: result => getDataLabel(get(result, 'metadataAvailable', '')),
    usageRestricted: result => getDataLabel(get(result, 'usageRestricted', '')),
    permittedFor: result => result.permittedFor.join('; '),
    freeContent: result => getDataLabel(get(result, 'freeContent', '')),
  };

  // fade in/out of filter-pane
  const toggleFilterPane = () => {
    setFilterPaneIsVisible(!filterPaneIsVisible);
  };

  const storeSearchString = () => {
    localStorage.setItem('finc-config-collections-search-string', searchString);
  };

  const rowURL = createRowURL(urls.collectionView, searchString);
  const rowFormatter = createRowFormatter(rowURL, onSelectRow);
  const count = collection ? collection.totalCount() : 0;
  const query = queryGetter() || {};
  const sortOrder = query.sort || '';

  if (!searchableIndexes) {
    searchableIndexes = rawSearchableIndexes.map(index => (
      { value: index.value, label: intl.formatMessage({ id: `ui-finc-config.collection.search.${index.label}` }) }
    ));
  }

  return (
    <SearchAndSortQuery
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
                  defaultWidth="18%"
                  id="pane-collection-filter"
                  renderHeader={() => renderFilterPaneHeader({ toggleFilterPane })}
                >
                  <form onSubmit={onSubmitSearch}>
                    {renderNavigation('collection')}
                    <div>
                      <SearchField
                        ariaLabel={intl.formatMessage({ id: 'ui-finc-config.searchInputLabel' })}
                        autoFocus
                        id="collectionSearchField"
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
                        id="collectionSubmitSearch"
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
                    <CollectionFilters
                      activeFilters={activeFilters.state}
                      filterData={filterData}
                      filterHandlers={getFilterHandlers()}
                    />
                  </form>
                </Pane>
              }
              <Pane
                defaultWidth="fill"
                id="pane-collection-results"
                padContent={false}
                renderHeader={() => renderResultsPaneHeader({
                  activeFilters,
                  createUrl: `${urls.collectionCreate()}${searchString}`,
                  disableRecordCreation,
                  filterPaneIsVisible,
                  paneTitleId: 'ui-finc-config.collections.title',
                  permission: 'ui-finc-config.create',
                  result: collection,
                  toggleFilterPane,
                })}
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
                  contentData={contentData}
                  formatter={resultsFormatter}
                  id="list-collections"
                  isEmptyMessage={renderIsEmptyMessage(query, collection, filterPaneIsVisible)}
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
                  visibleColumns={
                    ['label', 'mdSource', 'metadataAvailable', 'usageRestricted', 'permittedFor', 'freeContent']
                  }
                />
              </Pane>
              {children}
            </Paneset>
          );
        }
      }
    </SearchAndSortQuery>
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
};

export default injectIntl(withRouter(MetadataCollections));
