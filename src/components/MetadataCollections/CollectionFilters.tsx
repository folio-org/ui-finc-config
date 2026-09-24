import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { CheckboxFilterAccordion } from '@folio/stripes-leipzig-components';
import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
  FilterAccordionHeaderProps,
  Selection,
} from '@folio/stripes/components';

import {
  ActiveFilters,
  FilterHandlers,
  MdSource,
} from '../../types';
import { buildFilterState } from '../../util/filterUtils';
import filterConfig from './filterConfigData';

export interface CollectionFiltersProps {
  activeFilters?: ActiveFilters;
  filterData: {
    mdSources?: MdSource[];
  };
  filterHandlers: FilterHandlers;
}

const CollectionFilters = ({
  activeFilters = {
    metadataAvailable: [],
    usageRestricted: [],
    freeContent: [],
    mdSource: [],
  },
  filterData,
  filterHandlers,
}: CollectionFiltersProps) => {
  const { formatMessage } = useIntl();

  const filterState = useMemo(
    // skip for mdSource filter as it is dynamic and handled separately
    () => buildFilterState(
      filterConfig.filter(f => f.name !== 'mdSource'),
      formatMessage
    ),
    [formatMessage]
  );

  const renderCheckboxFilter = (key: string) => (
    <CheckboxFilterAccordion
      activeFilters={activeFilters}
      dataOptions={filterState[key] ?? []}
      filterHandlers={filterHandlers}
      filterKey={key}
      label={formatMessage({ id: `ui-finc-config.collection.${key}` })}
    />
  );

  const renderMetadataSourceFilter = () => {
    // use dynamic filter values from okapi
    const dataOptions = (filterData.mdSources || []).map((mdSource: MdSource) => ({
      value: mdSource.id,
      label: mdSource.label,
    }));

    const mdSourceFilters = activeFilters.mdSource || [];

    return (
      <Accordion<FilterAccordionHeaderProps>
        displayClearButton={mdSourceFilters.length > 0}
        header={FilterAccordionHeader}
        id="filter-accordion-mdSource"
        label={formatMessage({ id: 'ui-finc-config.collection.mdSource' })}
        onClearFilter={() => { filterHandlers.clearGroup('mdSource'); }}
        separator={false}
      >
        <Selection
          dataOptions={dataOptions}
          id="mdSource-filter"
          onChange={(value: string) => filterHandlers.state({ ...activeFilters, mdSource: [value] })}
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

export default CollectionFilters;
