import { noop } from 'lodash';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  Button,
  NoValue,
  PaneHeader,
  PaneMenu,
} from '@folio/stripes/components';
import {
  AppIcon,
  IfPermission,
} from '@folio/stripes/core';
import {
  CollapseFilterPaneButton,
  ExpandFilterPaneButton,
  SearchAndSortNoResultsMessage as NoResultsMessage,
} from '@folio/stripes/smart-components';

import FincNavigation from '../Navigation/FincNavigation';

export const createRowFormatter = (rowURL, onSelectRow) => {
  return (row) => {
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
};

// generate url for record-details
export const createRowURL = (buildUrl, searchString) => {
  return (id) => `${buildUrl(id)}${searchString}`;
};

export const getDataLabel = (fieldValue) => {
  if (fieldValue !== '') {
    return <FormattedMessage id={`ui-finc-config.dataOption.${fieldValue}`} />;
  } else {
    return <NoValue />;
  }
};

export const renderIsEmptyMessage = (query, result, filterPaneIsVisible) => {
  if (!result) {
    return <FormattedMessage id="ui-finc-config.noSourceYet" />;
  }

  return (
    <NoResultsMessage
      filterPaneIsVisible={filterPaneIsVisible}
      searchTerm={query.query || ''}
      source={result}
      toggleFilterPane={noop}
    />
  );
};

export const renderNavigation = (id) => (
  <FincNavigation
    id={id}
  />
);

export const renderFilterPaneHeader = ({ toggleFilterPane }) => (
  <PaneHeader
    lastMenu={
      <PaneMenu>
        <CollapseFilterPaneButton onClick={toggleFilterPane} />
      </PaneMenu>
      }
    paneTitle={<FormattedMessage id="stripes-smart-components.searchAndFilter" />}
  />
);

// fade in / out the filter menu
export const renderResultsFirstMenu = ({
  filters,
  filterPaneIsVisible,
  toggleFilterPane,
}) => {
  const filterCount = filters?.string ? filters.string.split(',').length : 0;

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

// button for creating a new record
export const renderResultsLastMenu = ({
  permission,
  createUrl,
  disableRecordCreation,
}) => {
  if (disableRecordCreation) {
    return null;
  }

  return (
    <IfPermission perm={permission}>
      <PaneMenu>
        <FormattedMessage id="ui-finc-config.form.create">
          {ariaLabel => (
            <Button
              aria-label={ariaLabel}
              buttonStyle="primary"
              id="clickable-new-record"
              marginBottom0
              to={createUrl}
            >
              <FormattedMessage id="stripes-smart-components.new" />
            </Button>
          )}
        </FormattedMessage>
      </PaneMenu>
    </IfPermission>
  );
};

// counting records of result list
export const renderResultsPaneSubtitle = (col) => {
  if (col) {
    const count = col ? col.totalCount() : 0;
    return <FormattedMessage id="stripes-smart-components.searchResultsCountHeader" values={{ count }} />;
  }

  return <FormattedMessage id="stripes-smart-components.searchCriteria" />;
};

export const renderResultsPaneHeader = ({
  activeFilters,
  createUrl,
  result,
  disableRecordCreation,
  filterPaneIsVisible,
  paneTitleId,
  permission,
  toggleFilterPane,
}) => (
  <PaneHeader
    appIcon={<AppIcon app="finc-config" />}
    firstMenu={renderResultsFirstMenu({
      filters: activeFilters,
      filterPaneIsVisible,
      toggleFilterPane,
    })}
    lastMenu={renderResultsLastMenu({
      permission,
      createUrl,
      disableRecordCreation,
    })}
    paneSub={renderResultsPaneSubtitle(result)}
    paneTitle={<FormattedMessage id={paneTitleId} />}
  />
);
