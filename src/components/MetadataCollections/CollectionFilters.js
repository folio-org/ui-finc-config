import PropTypes from 'prop-types';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
  Selection,
} from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';

import { useUpdatedFilters } from '../../hooks';
import filterConfig from './filterConfigData';

const CollectionFilters = ({
  activeFilters = {
    metadataAvailable: [],
    usageRestricted: [],
    freeContent: [],
    mdSource: [],
  },
  filterData,
  filterHandlers,
}) => {
  const [filterState, setFilterState] = useState({
    metadataAvailable: [],
    usageRestricted: [],
    freeContent: [],
    mdSource: [],
  });

  useUpdatedFilters({
    dynamicKey: 'mdSource',
    filterConfig,
    filterData,
    filterState,
    setFilterState,
  });

  const renderCheckboxFilter = (key) => {
    const groupFilters = activeFilters[key] || [];

    return (
      <Accordion
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${key}`}
        label={<FormattedMessage id={`ui-finc-config.collection.${key}`} />}
        onClearFilter={() => { filterHandlers.clearGroup(key); }}
        separator={false}
      >
        <CheckboxFilter
          dataOptions={filterState[key]}
          name={key}
          onChange={(group) => { filterHandlers.state({ ...activeFilters, [group.name]: group.values }); }}
          selectedValues={groupFilters}
        />
      </Accordion>
    );
  };

  const renderMetadataSourceFilter = () => {
    const mdSources = filterData.mdSources;
    const dataOptions = mdSources.map(mdSource => ({
      value: mdSource.id,
      label: mdSource.label,
    }));

    const mdSourceFilters = activeFilters.mdSource || [];

    return (
      <Accordion
        displayClearButton={mdSourceFilters.length > 0}
        header={FilterAccordionHeader}
        id="filter-accordion-mdSource"
        label={<FormattedMessage id="ui-finc-config.collection.mdSource" />}
        onClearFilter={() => { filterHandlers.clearGroup('mdSource'); }}
        separator={false}
      >
        <Selection
          dataOptions={dataOptions}
          id="mdSource-filter"
          onChange={value => filterHandlers.state({ ...activeFilters, mdSource: [value] })}
          placeholder=""
          value={mdSourceFilters[0] || ''}
        />
      </Accordion>
    );
  };

  return (
    <AccordionSet>
      {renderMetadataSourceFilter()}
      {renderCheckboxFilter('metadataAvailable')}
      {renderCheckboxFilter('usageRestricted')}
      {renderCheckboxFilter('freeContent')}
    </AccordionSet>
  );
};

CollectionFilters.propTypes = {
  activeFilters: PropTypes.object,
  filterData: PropTypes.object,
  filterHandlers: PropTypes.object,
};

export default CollectionFilters;
