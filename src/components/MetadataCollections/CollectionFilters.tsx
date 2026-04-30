import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
  FilterAccordionHeaderProps,
  Selection,
} from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';

import {
  ActiveFilters,
  FilterHandlers,
  MdSource,
} from '../../types';
import { buildFilterState } from '../../util/filterUtils';
import filterConfig from './filterConfigData';

interface Props {
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
}: Props) => {
  const { formatMessage } = useIntl();

  const filterState = useMemo(
    // skip for mdSource filter as it is dynamic and handled separately
    () => buildFilterState(
      filterConfig.filter(f => f.name !== 'mdSource'),
      formatMessage
    ),
    [formatMessage]
  );

  const renderCheckboxFilter = (key: string) => {
    const groupFilters = activeFilters[key] || [];

    return (
      <Accordion<FilterAccordionHeaderProps>
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${key}`}
        label={formatMessage({ id: `ui-finc-config.collection.${key}` })}
        onClearFilter={() => { filterHandlers.clearGroup(key); }}
        separator={false}
      >
        <CheckboxFilter
          dataOptions={filterState[key] ?? []}
          name={key}
          onChange={(group) => { filterHandlers.state({ ...activeFilters, [group.name]: group.values }); }}
          selectedValues={groupFilters}
        />
      </Accordion>
    );
  };

  const renderMetadataSourceFilter = () => {
    // use dynamic filter values from okapi
    const dataOptions = (filterData.mdSources || []).map(mdSource => ({
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
