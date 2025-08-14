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
import SourceFilters from './SourceFilters';

let searchableIndexes;
const defaultFilter = { status: ['active', 'implementation'] };
const defaultSearch = { query: '', qindex: '' };
const defaultSort = { sort: 'label' };

const rawSearchableIndexes = [
  { label: 'all', value: '', makeQuery: term => `(label="${term}*" or description="${term}*" or sourceId="${term}*")` },
  { label: 'label', value: 'label', makeQuery: term => `(label="${term}*")` },
  { label: 'description', value: 'description', makeQuery: term => `(description="${term}*")` },
  { label: 'sourceId', value: 'sourceId', makeQuery: term => `(sourceId="${term}*")` },
];

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

  const resultsFormatter = {
    label: result => result.label,
    sourceId: result => result.sourceId,
    status: result => getDataLabel(get(result, 'status', '')),
    solrShard: result => result.solrShard,
    lastProcessed: result => result.lastProcessed,
  };

  // fade in/out of filter-pane
  const toggleFilterPane = () => {
    setFilterPaneIsVisible(!filterPaneIsVisible);
  };

  const storeSearchString = () => {
    localStorage.setItem('finc-config-sources-search-string', searchString);
  };

  const rowURL = createRowURL(urls.sourceView, searchString);
  const rowFormatter = createRowFormatter(rowURL, onSelectRow);
  const count = source ? source.totalCount() : 0;
  const query = queryGetter() || {};
  const sortOrder = query.sort || '';

  if (!searchableIndexes) {
    searchableIndexes = rawSearchableIndexes.map(index => (
      { value: index.value, label: intl.formatMessage({ id: `ui-finc-config.source.search.${index.label}` }) }
    ));
  }

  return (
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
                  defaultWidth="18%"
                  id="pane-source-filter"
                  renderHeader={() => renderFilterPaneHeader({ toggleFilterPane })}
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
                defaultWidth="fill"
                id="pane-source-results"
                padContent={false}
                renderHeader={() => renderResultsPaneHeader({
                  activeFilters,
                  createUrl: `${urls.sourceCreate()}${searchString}`,
                  disableRecordCreation,
                  filterPaneIsVisible,
                  paneTitleId: 'ui-finc-config.sources.title',
                  permission: 'ui-finc-config.create',
                  result: source,
                  toggleFilterPane,
                })}
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
                  isEmptyMessage={renderIsEmptyMessage(query, source, filterPaneIsVisible)}
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
  );
};

MetadataSources.propTypes = {
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
